"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

// --- 1. REGISTER ACTION (Modified for Confetti) ---
export async function registerAction(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const age = formData.get("age") as string;

  if (!email || !password || !age) {
    return { success: false, message: "Please fill in all required fields" };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, message: "User already exists with this email" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || "",
        age,
      },
    });

    // Create session
    const cookieStore = await cookies();
    cookieStore.set("userId", user.id, { httpOnly: true, path: "/" });

    // CRITICAL CHANGE: We return success instead of redirecting.
    // This allows the Client Component to show the Confetti first.
    return { success: true, message: "Account created successfully!" };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

// UPDATE THIS FUNCTION
export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return { success: false, message: "Invalid credentials" };
    }

    const cookieStore = await cookies();
    cookieStore.set("userId", user.id, { httpOnly: true, path: "/" });

    // --- ROLE BASED REDIRECT ---
    if (user.role === "USER") {
      return { success: true, redirectUrl: "/dashboard" };
    } else {
      // Admins, Instructors, etc. go to Admin Panel
      return { success: true, redirectUrl: "/admin" };
    }
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Something went wrong." };
  }
}

// --- 3. LOGOUT ACTION ---
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("userId");
  redirect("/login");
}

// --- 4. AI MENTOR ACTION ---

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Canonical knowledge (SINGLE SOURCE OF TRUTH)
const CASTPOTRO_CONTEXT = `
Castpotro is a personalized learning platform focused on soft skills.
It works like Duolingo but for communication, leadership, critical thinking,
ethics, teamwork, and problem solving.

Key ideas:
- Learners follow personalized learning paths
- Progress is milestone-based, not time-based
- Skills are validated through activities, discussions, and events
- User learning profiles can be recorded on blockchain for verification
- The long-term goal is employability and real-world impact

Castpotro runs events, communities, and learning challenges.
It is NOT a language learning app.
It focuses on skill growth, proof of learning, and credibility.
`;

export async function chatWithGemini(
  history: { role: "user" | "ai"; text: string }[],
  message: string,
) {
  try {
    // Using 'gemini-1.5-flash' as it is the standard stable model for this SDK.
    // If you have access to newer previews, you can change this string.
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      systemInstruction: `
        You are the official AI assistant for the Castpotro website.

        Rules you MUST follow:
        - Only answer questions related to Castpotro
        - Use the provided context as your primary knowledge
        - Be clear, concise, and honest
        - If something is unknown or not decided, say so
        - If a question is unrelated, politely redirect to Castpotro topics
        - Never invent features, pricing, or guarantees

        Context:
        ${CASTPOTRO_CONTEXT}
      `,
    });

    // Convert history to Gemini format
    let formattedHistory = history.map((msg) => ({
      role: msg.role === "ai" ? "model" : "user",
      parts: [{ text: msg.text }],
    }));

    // Gemini requires first message to be user
    if (formattedHistory.length > 0 && formattedHistory[0].role === "model") {
      formattedHistory.shift();
    }

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(message);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to my brain right now. Please check my API key!";
  }
}

// --- 5. GET USER PROFILE (New) ---
export async function getUserProfile() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    });
    return user;
  } catch (error) {
    console.error("Fetch profile error:", error);
    return null;
  }
}

// --- 5. ENROLLMENT (Buying a course) ---
export async function createEnrollment(courseId: string, cost: number) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) return { success: false, message: "Not authenticated" };

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Deduct Coins
      const user = await tx.user.update({
        where: { id: userId },
        data: { coins: { decrement: cost } },
      });

      if (user.coins < 0) {
        throw new Error("Insufficient coins");
      }

      // 2. Create Enrollment
      await tx.enrollment.create({
        data: { userId, courseId },
      });
    });

    // Revalidate dashboard to update the UI (unlock the course)
    // using revalidatePath from "next/cache"
    // Make sure to import { revalidatePath } from "next/cache"; at the top
    return { success: true };
  } catch (error) {
    console.error("Enrollment error:", error);
    return { success: false };
  }
}

// --- 6. COMPLETE LESSON (Progress Tracking) ---
export async function completeLesson(courseId: string, lessonId: string) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) return { success: false };

  try {
    // 1. Find the enrollment for this user + course
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    if (!enrollment) throw new Error("User not enrolled in this course");

    // 2. Mark lesson as complete
    // We use create because 'CompletedLesson' is a log of finished items
    await prisma.completedLesson.create({
      data: {
        enrollmentId: enrollment.id,
        lessonId: lessonId,
      },
    });

    // 3. Optional: Add XP reward
    await prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: 50 } },
    });

    return { success: true };
  } catch (error) {
    // If it fails (e.g., already completed), we still return success to proceed
    console.log("Lesson already completed or error:", error);
    return { success: true };
  }
}

// --- JOB ACTIONS ---

export async function applyForJob(jobId: string) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) return { success: false, message: "Not authenticated" };

  try {
    // Check if job exists and is open
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job || !job.isOpen) {
      return { success: false, message: "Job is no longer available" };
    }

    // Create Application
    await prisma.application.create({
      data: {
        userId,
        jobId,
      },
    });

    revalidatePath("/dashboard/jobs");
    return { success: true };
  } catch (error) {
    console.error("Application error:", error);
    return { success: false, message: "Already applied or error occurred" };
  }
}

export async function hireApplicant(applicationId: string, jobId: string) {
  try {
    // Transaction: Mark application as HIRED, Close the Job
    await prisma.$transaction([
      prisma.application.update({
        where: { id: applicationId },
        data: { status: "HIRED" },
      }),
      prisma.job.update({
        where: { id: jobId },
        data: { isOpen: false }, // This removes it from the public board
      }),
    ]);

    revalidatePath("/admin/jobs");
    return { success: true };
  } catch (error) {
    console.error("Hiring error:", error);
    return { success: false };
  }
}

export async function rejectApplicant(applicationId: string) {
  try {
    await prisma.application.update({
      where: { id: applicationId },
      data: { status: "REJECTED" },
    });

    revalidatePath("/admin/jobs");
    return { success: true };
  } catch (error) {
    console.error("Rejection error:", error);
    return { success: false };
  }
}

// --- EVENT ACTIONS ---

export async function registerForEvent(eventId: string) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) return { success: false, message: "Not authenticated" };

  try {
    // Use a transaction to ensure the check and registration happen together
    await prisma.$transaction(async (tx) => {
      // 1. Get the event's capacity
      const event = await tx.event.findUnique({
        where: { id: eventId },
        select: { capacity: true, title: true },
      });

      if (!event) throw new Error("Event not found");

      // 2. Count how many people are already registered
      const currentRegistrations = await tx.eventRegistration.count({
        where: { eventId },
      });

      // 3. STOP if the event is full
      if (currentRegistrations >= event.capacity) {
        throw new Error("Event is full");
      }

      // 4. If space is available, create the registration
      await tx.eventRegistration.create({
        data: {
          userId,
          eventId,
        },
      });
    });

    revalidatePath("/dashboard/events");
    return { success: true };
  } catch (error: any) {
    // Handle specific errors
    if (error.message === "Event is full") {
      return { success: false, message: "Sorry, this event is fully booked." };
    }

    // Prisma error code for Unique Constraint (User already registered)
    if (error.code === "P2002") {
      return {
        success: false,
        message: "You are already registered for this event.",
      };
    }

    console.error("Registration error:", error);
    return { success: false, message: "Failed to register" };
  }
}

// ADMIN ONLY ACTION
export async function updateEventLink(eventId: string, link: string) {
  try {
    // 1. Update Event
    const event = await prisma.event.update({
      where: { id: eventId },
      data: { meetingLink: link },
      include: { registrations: true },
    });

    // 2. Send Notification to ALL Registrants
    // We use createMany to be efficient
    if (event.registrations.length > 0) {
      await prisma.notification.createMany({
        data: event.registrations.map((reg) => ({
          userId: reg.userId,
          title: "Meeting Link Added",
          message: `The link for "${event.title}" has been updated. Click to join.`,
          type: "EVENT",
          link: link,
        })),
      });
    }

    revalidatePath("/admin/events");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

// --- NOTIFICATION ACTIONS ---

export async function markNotificationRead(notifId: string) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) return;

  await prisma.notification.update({
    where: { id: notifId },
    data: { isRead: true },
  });

  revalidatePath("/dashboard/notifications");
}

// --- NEW: RECOMMENDATION ENGINE ---
export async function getRecommendations(interests: string[]) {
  console.log("🔍 Generating recommendations for:", interests);

  // 1. Fetch Matching Courses
  // Search in Title OR Description
  const recommendedCourses = await prisma.course.findMany({
    where: {
      OR: [
        ...interests.map((i) => ({ title: { contains: i } })),
        ...interests.map((i) => ({ description: { contains: i } })),
        // "Smart" mappings
        ...(interests.includes("Business")
          ? [{ title: { contains: "Startup" } }]
          : []),
        ...(interests.includes("AI")
          ? [{ title: { contains: "Language" } }]
          : []),
      ],
    },
    take: 3,
    include: {
      units: {
        include: { lessons: true },
      },
    },
  });

  // 2. Fetch Matching Jobs
  // FIXED: Removed 'tags' check. Now checks 'role' and 'company'
  const recommendedJobs = await prisma.job.findMany({
    where: {
      OR: [
        ...interests.map((i) => ({ role: { contains: i } })),
        ...interests.map((i) => ({ company: { contains: i } })),
        // "Smart" mappings for jobs
        ...(interests.includes("AI")
          ? [{ role: { contains: "Engineer" } }]
          : []),
        ...(interests.includes("Python")
          ? [{ role: { contains: "Engineer" } }]
          : []),
        ...(interests.includes("Design")
          ? [{ role: { contains: "Designer" } }]
          : []),
        ...(interests.includes("Marketing")
          ? [{ role: { contains: "Content" } }]
          : []),
      ],
    },
    take: 2,
  });

  // 3. Fetch Upcoming Events
  const upcomingEvents = await prisma.event.findMany({
    orderBy: { date: "asc" },
    take: 2,
  });

  return {
    courses: recommendedCourses,
    jobs: recommendedJobs,
    events: upcomingEvents,
  };
}

// --- NEW: SAVE USER PLAN ---
export async function saveUserPlan(courseIds: string[]) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) return { success: false, message: "User not found" };

  try {
    // Loop through recommended course IDs and enroll the user
    for (const courseId of courseIds) {
      // Check if already enrolled to avoid crashing/duplicates
      const existing = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId } },
      });

      if (!existing) {
        // Create enrollment with 0 progress
        await prisma.enrollment.create({
          data: {
            userId,
            courseId,
            progress: 0,
          },
        });
      }
    }

    // Optional: Reward user with starting Coins for finishing the setup
    await prisma.user.update({
      where: { id: userId },
      data: { coins: { increment: 50 } },
    });

    // Ensure the dashboard is fresh when they arrive
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Failed to save plan:", error);
    return { success: false };
  }
}
