"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// --- COURSE ACTIONS ---
export async function createCourse(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const icon = (formData.get("icon") as string) || "BookOpen";

  await prisma.course.create({
    data: { title, description, icon },
  });
  revalidatePath("/admin/courses");
}

export async function deleteCourse(id: string) {
  await prisma.course.delete({ where: { id } });
  revalidatePath("/admin/courses");
}

// --- UNIT ACTIONS ---
export async function createUnit(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const courseId = formData.get("courseId") as string;
  const order = parseInt(formData.get("order") as string) || 1;

  await prisma.unit.create({
    data: { title, description, order, courseId },
  });
  revalidatePath(`/admin/courses/${courseId}`);
}

export async function deleteUnit(id: string, courseId: string) {
  await prisma.unit.delete({ where: { id } });
  revalidatePath(`/admin/courses/${courseId}`);
}

// --- LESSON ACTIONS ---
export async function createLesson(formData: FormData) {
  const title = formData.get("title") as string;
  const theory = formData.get("theory") as string;
  const videoUrl = formData.get("videoUrl") as string;
  const unitId = formData.get("unitId") as string;
  const courseId = formData.get("courseId") as string; // For revalidation

  await prisma.lesson.create({
    data: { title, theory, videoUrl, unitId },
  });
  revalidatePath(`/admin/courses/${courseId}/units/${unitId}`);
}

export async function deleteLesson(
  id: string,
  unitId: string,
  courseId: string,
) {
  await prisma.lesson.delete({ where: { id } });
  revalidatePath(`/admin/courses/${courseId}/units/${unitId}`);
}

// --- QUIZ ACTIONS ---
export async function createQuizQuestion(formData: FormData) {
  const lessonId = formData.get("lessonId") as string;
  const question = formData.get("question") as string;

  // Collect options
  const option0 = formData.get("option0") as string;
  const option1 = formData.get("option1") as string;
  const option2 = formData.get("option2") as string;

  const correct = parseInt(formData.get("correct") as string);
  const pathToRevalidate = formData.get("path") as string;

  await prisma.quiz.create({
    data: {
      lessonId,
      question,
      options: [option0, option1, option2], // Store as JSON array
      correct,
    },
  });

  revalidatePath(pathToRevalidate);
}

export async function deleteQuizQuestion(id: string, path: string) {
  await prisma.quiz.delete({ where: { id } });
  revalidatePath(path);
}

export async function createEvent(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const type = formData.get("type") as string;
  const capacity = parseInt(formData.get("capacity") as string);
  const dateStr = formData.get("date") as string;

  const eventDate = new Date(dateStr);
  const now = new Date();

  // 1. Validate Date
  if (eventDate < now) {
    // In a server action triggered by a form, throwing an error will prevent execution.
    // Ideally, you would return { error: "..." } and handle it in the UI,
    // but throwing here prevents the bad write immediately.
    throw new Error("Cannot schedule events in the past.");
  }

  await prisma.event.create({
    data: {
      title,
      description,
      location,
      type,
      capacity,
      date: eventDate,
    },
  });

  revalidatePath("/admin/events");
  redirect("/admin/events");
}

// --- UPDATE EVENT ---
export async function updateEvent(eventId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const type = formData.get("type") as string;
  const capacity = parseInt(formData.get("capacity") as string);
  const dateStr = formData.get("date") as string;

  const eventDate = new Date(dateStr);
  const now = new Date();

  // 2. Validate Date on Update as well
  if (eventDate < now) {
    throw new Error("Cannot reschedule event to the past.");
  }

  await prisma.event.update({
    where: { id: eventId },
    data: {
      title,
      description,
      location,
      type,
      capacity,
      date: eventDate,
    },
  });

  revalidatePath(`/admin/events/${eventId}`);
  revalidatePath("/admin/events");
  redirect("/admin/events");
}
// --- DELETE EVENT ---
export async function deleteEvent(eventId: string) {
  await prisma.event.delete({ where: { id: eventId } });
  revalidatePath("/admin/events");
}

// --- QUEST MANAGEMENT ---

export async function createQuest(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const xp = parseInt(formData.get("xp") as string);
  const sdgId = parseInt(formData.get("sdgId") as string);
  const frequency = formData.get("frequency") as string; // "DAILY", "WEEKLY", "ONCE"
  const verificationType = formData.get("verificationType") as string; // "AI_IMAGE", "TEXT"
  const aiPrompt = formData.get("aiPrompt") as string;

  await prisma.quest.create({
    data: {
      title,
      description,
      xp,
      sdgId,
      frequency,
      verificationType,
      aiPrompt: aiPrompt || null,
      isActive: true,
    },
  });

  revalidatePath("/admin/quests");
  redirect("/admin/quests");
}

export async function deleteQuest(id: string) {
  await prisma.quest.delete({ where: { id } });
  revalidatePath("/admin/quests");
}

// --- SUBMISSION VERIFICATION ---

export async function reviewSubmission(
  submissionId: string,
  status: "APPROVED" | "REJECTED",
  feedback: string,
) {
  const submission = await prisma.questSubmission.findUnique({
    where: { id: submissionId },
    include: { quest: true },
  });

  if (!submission) return { success: false };

  await prisma.$transaction(async (tx) => {
    // 1. Update Submission Status
    await tx.questSubmission.update({
      where: { id: submissionId },
      data: { status, feedback },
    });

    // 2. If Approved, Award XP to User
    if (status === "APPROVED" && submission.status !== "APPROVED") {
      await tx.user.update({
        where: { id: submission.userId },
        data: { xp: { increment: submission.quest.xp } },
      });
    }
  });

  revalidatePath(`/admin/quests/${submission.questId}`);
  return { success: true };
}

// --- USER MANAGEMENT ---

export async function updateUserRole(userId: string, newRole: string) {
  // Security: In a real app, verify the current user is SUPER_ADMIN here
  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole as any },
  });
  revalidatePath("/admin/users");
}

export async function deleteUser(userId: string) {
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
}

export async function updateAdminProfile(formData: FormData) {
  const userId = formData.get("userId") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  await prisma.user.update({
    where: { id: userId },
    data: { name, email },
  });
  revalidatePath("/admin/settings");
}

// finish event
export async function finishEvent(eventId: string) {
  try {
    // 1. Fetch the event to check the date
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { date: true },
    });

    if (!event) {
      return { success: false, message: "Event not found" };
    }

    // 2. Prevent finishing if the event hasn't started yet
    if (new Date() < event.date) {
      return {
        success: false,
        message: "Cannot finish an event before it starts.",
      };
    }

    // 3. Update status
    await prisma.event.update({
      where: { id: eventId },
      data: { status: "COMPLETED" },
    });

    revalidatePath("/admin/events");
    return { success: true };
  } catch (error) {
    console.error("Failed to finish event:", error);
    return { success: false, message: "Error updating event" };
  }
}

// --- JOB MANAGEMENT ---

export async function createJob(formData: FormData) {
  const role = formData.get("role") as string;
  const company = formData.get("company") as string;
  const location = formData.get("location") as string;
  const salary = formData.get("salary") as string;
  const type = formData.get("type") as string; // "Full-Time" or "Internship"

  // Optional: Link a course requirement
  const requiredCourseRaw = formData.get("requiredCourse") as string;
  const requiredCourse =
    requiredCourseRaw && requiredCourseRaw !== "none"
      ? requiredCourseRaw
      : null;

  // Checkbox handling (returns "on" if checked, null otherwise)
  const isPromoted = formData.get("isPromoted") === "on";

  await prisma.job.create({
    data: {
      role,
      company,
      location,
      salary,
      type,
      requiredCourse,
      isPromoted,
      isOpen: true, // Default to open
    },
  });

  revalidatePath("/admin/jobs");
  redirect("/admin/jobs");
}

export async function updateJob(jobId: string, formData: FormData) {
  const role = formData.get("role") as string;
  const company = formData.get("company") as string;
  const location = formData.get("location") as string;
  const salary = formData.get("salary") as string;
  const type = formData.get("type") as string;

  const requiredCourseRaw = formData.get("requiredCourse") as string;
  const requiredCourse =
    requiredCourseRaw && requiredCourseRaw !== "none"
      ? requiredCourseRaw
      : null;

  const isPromoted = formData.get("isPromoted") === "on";

  await prisma.job.update({
    where: { id: jobId },
    data: {
      role,
      company,
      location,
      salary,
      type,
      requiredCourse,
      isPromoted,
    },
  });

  revalidatePath("/admin/jobs");
  revalidatePath(`/admin/jobs/${jobId}`);
  redirect("/admin/jobs");
}

export async function toggleJobStatus(jobId: string, isOpen: boolean) {
  await prisma.job.update({
    where: { id: jobId },
    data: { isOpen },
  });
  revalidatePath("/admin/jobs");
}

export async function deleteJob(jobId: string) {
  await prisma.job.delete({ where: { id: jobId } });
  revalidatePath("/admin/jobs");
}

// 👇 NEW: Update Lesson Action
export async function updateLesson(
  lessonId: string, 
  data: { title: string; theory: string; videoUrl: string; path: string }
) {
  await prisma.lesson.update({
    where: { id: lessonId },
    data: {
      title: data.title,
      theory: data.theory, // This will be the long JSON string
      videoUrl: data.videoUrl
    }
  });
  
  revalidatePath(data.path);
  return { success: true };
}