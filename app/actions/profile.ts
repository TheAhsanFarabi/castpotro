"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// --- 1. GET FULL PROFILE & ACTIVITY ---
export async function getFullUserProfile() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        // Fetch Course Progress for Certificates
        enrollments: {
          include: {
            course: true,
            completedLessons: true,
          },
        },
        // Fetch Activity Data
        questSubmissions: {
          where: { status: "APPROVED" },
          take: 5,
          orderBy: { createdAt: "desc" },
          include: { quest: true },
        },
        eventRegistrations: {
          take: 5,
          orderBy: { createdAt: "desc" },
          include: { event: true },
        },
      },
    });

    if (!user) return null;

    // --- LOGIC: GENERATE CERTIFICATES ---
    // A course is "Certified" if user completed all lessons (simplified logic for now)
    // Or if progress > 90%
    const certificates = user.enrollments
      .filter((e) => e.progress >= 90 || e.completedLessons.length > 0)
      .map((e) => ({
        id: e.course.id,
        
        // 👇 CRITICAL FIX: ID for the database update
        enrollmentId: e.id, 

        title: e.course.title,
        issuer: "Castpotro Academy",
        issueDate: new Date(e.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        // Generate a fake Credential ID for display
        credentialId: `CP-${e.course.title.substring(0, 3).toUpperCase()}-${user.id.substring(0, 4)}-${Date.now().toString().substring(8)}`,
        
        // 👇 CRITICAL FIX: Hash for the UI state
        txHash: e.certificateHash || null, 
        
        skills: "Soft Skills, " + e.course.title,
      }));

    // --- LOGIC: COMPILE RECENT ACTIVITY ---
    // Merge Quests, Events, and Course progress into one timeline
    const activities = [
      ...user.questSubmissions.map((q) => ({
        id: q.id,
        type: "QUEST",
        title: `Completed Quest: ${q.quest.title}`,
        date: q.createdAt,
        xp: `+${q.quest.xp} XP`,
      })),
      ...user.eventRegistrations.map((e) => ({
        id: e.id,
        type: "EVENT",
        title: `Registered for: ${e.event.title}`,
        date: e.createdAt,
        xp: "+10 XP", // Base reward for registering
      })),
      ...user.enrollments.flatMap((e) =>
        e.completedLessons.map((l) => ({
          id: l.id,
          type: "LESSON",
          title: `Lesson Complete: ${e.course.title}`,
          date: l.completedAt,
          xp: "+50 XP",
        })),
      ),
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10); // Top 10 activities

    // --- LOGIC: LEAGUE CALCULATION ---
    let league = "Bronze";
    if (user.xp > 500) league = "Silver";
    if (user.xp > 1000) league = "Gold";
    if (user.xp > 2000) league = "Diamond";

    return {
      user: {
        id: user.id,
        name: user.name || "Learner",
        email: user.email,
        handle: user.name
          ? `@${user.name.replace(/\s+/g, "").toLowerCase()}`
          : "@learner",
        location: user.location || "Earth",
        bio: user.bio || "Ready to learn and grow.",
        xp: user.xp,
        league,
        coins: user.coins,
        avatar: (user.avatarConfig as any) || {
          color: "bg-[#0ea5e9]",
          shape: "rounded-full",
          icon: "👤",
        },
        banner: (user.bannerConfig as any) || {
          type: "gradient",
          style: { background: "linear-gradient(to right, #06b6d4, #3b82f6)" },
          name: "Ocean",
        },
      },
      certificates,
      activities,
    };
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    return null;
  }
}

// --- 2. UPDATE APPEARANCE ---
export async function updateAppearance(avatar: any, banner: any) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) return { success: false };

  await prisma.user.update({
    where: { id: userId },
    data: {
      avatarConfig: avatar,
      bannerConfig: banner,
    },
  });

  revalidatePath("/dashboard/profile");
  return { success: true };
}

// --- 3. UPDATE DETAILS (Bio/Location) ---
export async function updateProfileDetails(
  name: string,
  bio: string,
  location: string,
) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) return { success: false };

  await prisma.user.update({
    where: { id: userId },
    data: { name, bio, location },
  });

  revalidatePath("/dashboard/profile");
  return { success: true };
}

// --- 4. SAVE CERTIFICATE HASH (Post-Mint) ---
export async function saveCertHash(enrollmentId: string, hash: string) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) return { success: false };

  // Update DB
  await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: { certificateHash: hash }
  });

  revalidatePath("/dashboard/profile");
  return { success: true };
}