// "use server";

// import { prisma } from "@/lib/prisma";
// import { revalidatePath } from "next/cache";
// import { cookies } from "next/headers";
// import { writeFile, mkdir } from "fs/promises";
// import { join } from "path";
// import {
//   startOfWeek,
//   endOfWeek,
//   eachDayOfInterval,
//   format,
//   isSameDay,
//   subDays,
// } from "date-fns";

// // --- 1. SUBMIT QUEST (With Real File Upload) ---
// export async function submitQuest(formData: FormData) {
//   const cookieStore = await cookies();
//   const userId = cookieStore.get("userId")?.value;
//   if (!userId) return { success: false, message: "Not authenticated" };

//   const questId = formData.get("questId") as string;
//   const proofText = formData.get("proofText") as string;
//   const file = formData.get("proofImage") as File | null;

//   try {
//     const quest = await prisma.quest.findUnique({ where: { id: questId } });
//     if (!quest) throw new Error("Quest not found");

//     // --- HANDLE IMAGE UPLOAD ---
//     let proofImageUrl = null;

//     if (file && file.size > 0) {
//       // 1. Read file bytes
//       const bytes = await file.arrayBuffer();
//       const buffer = Buffer.from(bytes);

//       // 2. Create unique filename
//       const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
//       const filename = `quest-${questId}-${uniqueSuffix}-${file.name.replace(/\s/g, "-")}`;

//       // 3. Define path (public/uploads)
//       const uploadDir = join(process.cwd(), "public", "uploads");

//       // Ensure directory exists
//       await mkdir(uploadDir, { recursive: true });

//       // 4. Write file to disk
//       await writeFile(join(uploadDir, filename), buffer);

//       // 5. Set URL for database
//       proofImageUrl = `/uploads/${filename}`;
//     }

//     // --- AI VERIFICATION SIMULATION ---
//     let status = "PENDING";
//     let feedback = "Waiting for admin review.";
//     let aiConfidence = 0;

//     if (quest.verificationType === "AI_IMAGE" && proofImageUrl) {
//       // In a real app, send 'proofImageUrl' to Gemini API here
//       const mockSuccess = true;

//       if (mockSuccess) {
//         feedback = "System detected valid elements matching the prompt.";
//         aiConfidence = 0.92;
//       } else {
//         feedback = "System could not clearly identify the required items.";
//         aiConfidence = 0.45;
//       }
//     } else {
//       feedback = "Text submission received.";
//       aiConfidence = 0;
//     }

//     // --- DATABASE SAVE ---
//     await prisma.questSubmission.create({
//       data: {
//         userId,
//         questId,
//         proofText,
//         proofImage: proofImageUrl, // Now saving the REAL local path
//         status: "PENDING",
//         feedback,
//         aiConfidence,
//       },
//     });

//     revalidatePath("/dashboard/quests");
//     return {
//       success: true,
//       feedback: "Submitted! Waiting for Admin verification.",
//     };
//   } catch (error) {
//     console.error("Upload Error:", error);
//     return { success: false, message: "Submission failed" };
//   }
// }

// // ... (Keep getUserImpactDNA as is)
// export async function getUserImpactDNA(userId: string) {
//   const stats = await prisma.questSubmission.findMany({
//     where: {
//       userId,
//       status: "APPROVED",
//     },
//     include: {
//       quest: {
//         select: { sdgId: true, xp: true },
//       },
//     },
//   });

//   const dna: Record<number, number> = {};
//   stats.forEach((sub) => {
//     const sdg = sub.quest.sdgId;
//     dna[sdg] = (dna[sdg] || 0) + sub.quest.xp;
//   });

//   return dna;
// }

// // --- NEW: GET USER STREAK ---
// export async function getUserStreak(userId: string) {
//   // 1. Fetch dates of all Quest Submissions
//   const questDates = await prisma.questSubmission.findMany({
//     where: { userId },
//     select: { createdAt: true },
//     orderBy: { createdAt: "desc" },
//   });

//   // 2. Fetch dates of all Completed Lessons
//   const lessonDates = await prisma.completedLesson.findMany({
//     where: {
//       enrollment: { userId },
//     },
//     select: { completedAt: true },
//     orderBy: { completedAt: "desc" },
//   });

//   // 3. Combine and Normalize Dates (YYYY-MM-DD)
//   const allDates = [
//     ...questDates.map((q) => q.createdAt),
//     ...lessonDates.map((l) => l.completedAt),
//   ].map((date) => date.toISOString().split("T")[0]); // "2024-01-20"

//   const uniqueDates = Array.from(new Set(allDates)).sort().reverse(); // Descending order

//   // 4. Calculate Streak
//   let streak = 0;
//   const today = new Date().toISOString().split("T")[0];
//   const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

//   // Check if active today or yesterday (to keep streak alive)
//   let currentDateCheck = uniqueDates.includes(today) ? today : yesterday;

//   // If no activity today OR yesterday, streak is broken (0), unless we are just starting
//   if (!uniqueDates.includes(today) && !uniqueDates.includes(yesterday)) {
//     streak = 0;
//   } else {
//     // Count backwards
//     for (const date of uniqueDates) {
//       if (date === currentDateCheck) {
//         streak++;
//         // Move target to previous day
//         const prevDate = new Date(currentDateCheck);
//         prevDate.setDate(prevDate.getDate() - 1);
//         currentDateCheck = prevDate.toISOString().split("T")[0];
//       }
//     }
//   }

//   // 5. Calculate Weekly Activity (Mon - Sun)
//   const todayDate = new Date();
//   // Get start of week (Monday)
//   const dayOfWeek = todayDate.getDay(); // 0 (Sun) - 6 (Sat)
//   const diff = todayDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // adjust when day is sunday
//   const monday = new Date(todayDate.setDate(diff));

//   const weekActivity = [0, 1, 2, 3, 4, 5, 6].map((offset) => {
//     const d = new Date(monday);
//     d.setDate(monday.getDate() + offset);
//     const dateStr = d.toISOString().split("T")[0];
//     return uniqueDates.includes(dateStr);
//   });

//   return {
//     streak,
//     weekActivity, // [true, false, true, ...] for Mon-Sun
//   };
// }

"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

// --- 1. SUBMIT QUEST (With Real File Upload) ---
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
      const mockSuccess = true;

      if (mockSuccess) {
        feedback = "System detected valid elements matching the prompt.";
        aiConfidence = 0.92;
      } else {
        feedback = "System could not clearly identify the required items.";
        aiConfidence = 0.45;
      }
    } else {
      feedback = "Text submission received.";
      aiConfidence = 0;
    }

    // --- DATABASE SAVE ---
    await prisma.questSubmission.create({
      data: {
        userId,
        questId,
        proofText,
        proofImage: proofImageUrl, // Now saving the REAL local path
        status: "PENDING",
        feedback,
        aiConfidence,
      },
    });

    revalidatePath("/dashboard/quests");
    return {
      success: true,
      feedback: "Submitted! Waiting for Admin verification.",
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

// --- 3. GET USER STREAK (NEW) ---
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
