"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

// --- 1. GET FULL PROFILE (CURRENT USER) ---
export async function getFullUserProfile() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) return null;
  return getPublicUserProfile(userId);
}

// --- 2. GET PUBLIC PROFILE (ANY USER) ---
export async function getPublicUserProfile(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        enrollments: {
          include: {
            course: true,
            completedLessons: true,
          },
        },
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

    const certificates = user.enrollments
      .filter((e) => e.progress >= 90 || e.completedLessons.length > 0)
      .map((e) => ({
        id: e.course.id,
        enrollmentId: e.id,
        title: e.course.title,
        issuer: "Castpotro Academy",
        issueDate: new Date(e.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        credentialId: `CP-${e.course.title.substring(0, 3).toUpperCase()}-${user.id.substring(0, 4)}-${Date.now().toString().substring(8)}`,
        txHash: e.certificateHash || null,
        skills: "Soft Skills, " + e.course.title,
      }));

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
        xp: "+10 XP",
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
      .slice(0, 10);

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
        image: user.image,
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

// --- 3. UPLOAD PROFILE IMAGE ---
export async function uploadProfileImage(formData: FormData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) return { success: false, message: "Unauthorized" };

  const file = formData.get("file") as File;
  if (!file) return { success: false, message: "No file provided" };

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.split(".").pop();
    const fileName = `user-${userId}-${Date.now()}.${ext}`;
    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    const filePath = join(uploadDir, fileName);
    await writeFile(filePath, buffer);
    const imageUrl = `/uploads/${fileName}`;

    await prisma.user.update({
      where: { id: userId },
      data: { image: imageUrl },
    });

    revalidatePath("/dashboard/profile");
    return { success: true, imageUrl };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, message: "Upload failed" };
  }
}

// --- 4. UPDATE APPEARANCE (Modified) ---
// Added `shouldClearImage` parameter
export async function updateAppearance(avatar: any, banner: any, shouldClearImage: boolean = false) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) return { success: false };

  const updateData: any = {
    avatarConfig: avatar,
    bannerConfig: banner,
  };

  // Only clear the uploaded image if explicitly requested (e.g. switching back to avatar)
  if (shouldClearImage) {
    updateData.image = null;
  }

  await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  revalidatePath("/dashboard/profile");
  return { success: true };
}

// --- 5. UPDATE DETAILS ---
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

// --- 6. SAVE CERTIFICATE HASH ---
export async function saveCertHash(enrollmentId: string, hash: string) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) return { success: false };

  await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: { certificateHash: hash }
  });

  revalidatePath("/dashboard/profile");
  return { success: true };
}