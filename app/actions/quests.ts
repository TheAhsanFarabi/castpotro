"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

// --- 1. SUBMIT QUEST (With Real File Upload & Auto-XP) ---
export async function submitQuest(formData: FormData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) return { success: false, message: "Not authenticated" };

  const questId = formData.get("questId") as string;
  const proofText = formData.get("proofText") as string;
  const file = formData.get("proofImage") as File | null;

  try {
    const quest = await prisma.quest.findUnique({ where: { id: questId } });
    if (!quest) throw new Error("Quest not found");

    // --- HANDLE IMAGE UPLOAD ---
    let proofImageUrl = null;

    if (file && file.size > 0) {
      // 1. Read file bytes
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // 2. Create unique filename
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `quest-${questId}-${uniqueSuffix}-${file.name.replace(/\s/g, "-")}`;

      // 3. Define path (public/uploads)
      const uploadDir = join(process.cwd(), "public", "uploads");

      // Ensure directory exists
      await mkdir(uploadDir, { recursive: true });

      // 4. Write file to disk
      await writeFile(join(uploadDir, filename), buffer);

      // 5. Set URL for database
      proofImageUrl = `/uploads/${filename}`;
    }

    // --- AI VERIFICATION SIMULATION ---
    let status = "PENDING";
    let feedback = "Waiting for admin review.";
    let aiConfidence = 0;

    if (quest.verificationType === "AI_IMAGE" && proofImageUrl) {
      // In a real app, send 'proofImageUrl' to Gemini API here
      const mockSuccess = true; // SIMULATION

      if (mockSuccess) {
        status = "APPROVED"; // <--- FIX 1: Auto-approve if AI matches
        feedback =
          "System detected valid elements matching the prompt. XP Awarded!";
        aiConfidence = 0.92;
      } else {
        feedback = "System could not clearly identify the required items.";
        aiConfidence = 0.45;
        // Status remains PENDING (or REJECTED depending on strictness)
      }
    } else {
      feedback = "Text submission received.";
      aiConfidence = 0;
    }

    // --- DATABASE SAVE & XP UPDATE ---
    await prisma.$transaction(async (tx) => {
      // 1. Create Submission
      await tx.questSubmission.create({
        data: {
          userId,
          questId,
          proofText,
          proofImage: proofImageUrl,
          status,
          feedback,
          aiConfidence,
        },
      });

      // 2. FIX 2: Award XP immediately if Auto-Approved
      if (status === "APPROVED") {
        await tx.user.update({
          where: { id: userId },
          data: { xp: { increment: quest.xp } },
        });
      }
    });

    revalidatePath("/dashboard/quests");
    revalidatePath("/dashboard"); // Update dashboard stats (XP/Streak)

    return {
      success: true,
      feedback:
        status === "APPROVED"
          ? "Quest Completed! XP Added."
          : "Submitted! Waiting for review.",
    };
  } catch (error) {
    console.error("Upload Error:", error);
    return { success: false, message: "Submission failed" };
  }
}

// --- 2. IMPACT DNA ---
export async function getUserImpactDNA(userId: string) {
  const stats = await prisma.questSubmission.findMany({
    where: {
      userId,
      status: "APPROVED",
    },
    include: {
      quest: {
        select: { sdgId: true, xp: true },
      },
    },
  });

  const dna: Record<number, number> = {};
  stats.forEach((sub) => {
    const sdg = sub.quest.sdgId;
    dna[sdg] = (dna[sdg] || 0) + sub.quest.xp;
  });

  return dna;
}

// --- 3. GET USER STREAK ---
export async function getUserStreak(userId: string) {
  // 1. Fetch dates of all Quest Submissions
  const questDates = await prisma.questSubmission.findMany({
    where: { userId },
    select: { createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  // 2. Fetch dates of all Completed Lessons
  const lessonDates = await prisma.completedLesson.findMany({
    where: {
      enrollment: { userId },
    },
    select: { completedAt: true },
    orderBy: { completedAt: "desc" },
  });

  // 3. Combine and Normalize Dates (YYYY-MM-DD)
  const allDates = [
    ...questDates.map((q) => q.createdAt),
    ...lessonDates.map((l) => l.completedAt),
  ].map((date) => date.toISOString().split("T")[0]); // "2024-01-20"

  const uniqueDates = Array.from(new Set(allDates)).sort().reverse(); // Descending order

  // 4. Calculate Streak
  let streak = 0;
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  // Check if active today or yesterday (to keep streak alive)
  let currentDateCheck = uniqueDates.includes(today) ? today : yesterday;

  // If no activity today OR yesterday, streak is broken (0), unless we are just starting
  if (!uniqueDates.includes(today) && !uniqueDates.includes(yesterday)) {
    streak = 0;
  } else {
    // Count backwards
    for (const date of uniqueDates) {
      if (date === currentDateCheck) {
        streak++;
        // Move target to previous day
        const prevDate = new Date(currentDateCheck);
        prevDate.setDate(prevDate.getDate() - 1);
        currentDateCheck = prevDate.toISOString().split("T")[0];
      }
    }
  }

  // 5. Calculate Weekly Activity (Mon - Sun)
  const todayDate = new Date();
  // Get start of week (Monday)
  const dayOfWeek = todayDate.getDay(); // 0 (Sun) - 6 (Sat)
  const diff = todayDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // adjust when day is sunday
  const monday = new Date(todayDate.setDate(diff));

  const weekActivity = [0, 1, 2, 3, 4, 5, 6].map((offset) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + offset);
    const dateStr = d.toISOString().split("T")[0];
    return uniqueDates.includes(dateStr);
  });

  return {
    streak,
    weekActivity, // [true, false, true, ...] for Mon-Sun
  };
}

// --- 4. GET WEEKLY XP (NEW) ---
export async function getWeeklyXP(userId: string) {
  // 1. Determine Start of Week (Monday)
  const now = new Date();
  const day = now.getDay(); // 0 (Sun) - 6 (Sat)
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust if Sunday
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);

  // 2. Calculate XP from Quests (Approved this week)
  // Note: Using createdAt as proxy since QuestSubmission doesn't have updatedAt in schema
  const questSubmissions = await prisma.questSubmission.findMany({
    where: {
      userId,
      status: "APPROVED",
      createdAt: { gte: monday },
    },
    include: { quest: true },
  });
  const questXP = questSubmissions.reduce((acc, sub) => acc + sub.quest.xp, 0);

  // 3. Calculate XP from Lessons (Completed this week)
  // Assuming 10 XP per lesson for now
  const completedLessons = await prisma.completedLesson.findMany({
    where: {
      enrollment: { userId },
      completedAt: { gte: monday },
    },
  });
  const lessonXP = completedLessons.length * 10;

  return questXP + lessonXP;
}
