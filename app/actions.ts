"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

// --- 1. REGISTER ACTION ---
export async function registerAction(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const dobString = formData.get("dob") as string; // Get value like "2000-01-01"

  // NEW: Get the new fields
  const country = formData.get("country") as string;
  const university = formData.get("university") as string;

  if (!email || !password || !dobString || !country || !university) {
    // Added validation
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
        dob: new Date(dobString),
        // NEW: Save to database
        country,
        university,
      },
    });

    const cookieStore = await cookies();
    cookieStore.set("userId", user.id, { httpOnly: true, path: "/" });

    return { success: true, message: "Account created successfully!" };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

// UPDATE THIS FUNCTION TO RETURN A UNIFIED RESPONSE STRUCTURE WITH 'success', 'message', AND 'redirectUrl' FIELDS
export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return {
        success: false,
        message: "Invalid credentials",
        redirectUrl: undefined, // Explicitly include this
      };
    }

    const cookieStore = await cookies();
    cookieStore.set("userId", user.id, { httpOnly: true, path: "/" });

    if (user.role === "USER") {
      return {
        success: true,
        redirectUrl: "/dashboard",
        message: "", // Explicitly include this
      };
    } else {
      return {
        success: true,
        redirectUrl: "/admin",
        message: "", // Explicitly include this
      };
    }
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "Something went wrong.",
      redirectUrl: undefined, // Explicitly include this
    };
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
export async function applyForJob(jobId: string, submissionLink?: string) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) return { success: false, message: "Not authenticated" };

  try {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job || !job.isOpen) {
      return { success: false, message: "Job is no longer available" };
    }

    await prisma.$transaction(async (tx) => {
      // 1. Create Application
      await tx.application.create({
        data: {
          userId,
          jobId,
          submissionLink: submissionLink || null,
        },
      });

      // 2. NEW: Send Application Notification
      await tx.notification.create({
        data: {
          userId,
          title: `${job.role}::Application Submitted`,
          message: `You have successfully applied for the ${job.role} position at ${job.company}. We will notify you when there's an update.`,
          type: "JOB",
        },
      });
    });

    revalidatePath("/dashboard/jobs");
    return { success: true };
  } catch (error) {
    console.error("Application error:", error);
    return { success: false, message: "Already applied or error occurred" };
  }
}

// ADMIN ACTIONS: Rejecting or Hiring an applicant. These actions will update the application status and send a notification to the user about the outcome. The recruiter can also input feedback that will be included in the notification message. For simplicity, we will just have a standard message for rejection and a congratulatory message for hiring. The recruiter can customize these messages in the future if needed.
export async function rejectApplicant(applicationId: string, jobId: string) {
  try {
    const app = await prisma.application.update({
      where: { id: applicationId },
      data: { status: "REJECTED" },
      include: { job: true },
    });

    await prisma.notification.create({
      data: {
        userId: app.userId,
        title: `${app.job.role}::Application Update`,
        message: `Thank you for applying for the ${app.job.role} position.\n\nUnfortunately, the team has decided to move forward with other candidates at this time. Keep leveling up your skills!`,
        type: "JOB",
      },
    });

    revalidatePath(`/admin/jobs/${jobId}`);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

// The hireApplicant function will update the application status to "HIRED" and send a notification to the user congratulating them on being selected for the position. The message will also mention that the recruiter will be in touch with the next steps. This keeps the user informed and excited about their new opportunity.
export async function hireApplicant(applicationId: string, jobId: string) {
  try {
    const app = await prisma.application.update({
      where: { id: applicationId },
      data: { status: "HIRED" },
      include: { job: true },
    });

    await prisma.notification.create({
      data: {
        userId: app.userId,
        title: `${app.job.role}::Congratulations! 🎉`,
        message: `Great news! You have been selected for the ${app.job.role} position.\n\nThe recruiter will be in touch with your next steps.`,
        type: "JOB",
      },
    });

    revalidatePath(`/admin/jobs/${jobId}`);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
// --- EVENT ACTIONS ---

export async function registerForEvent(eventId: string) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) return { success: false, message: "Not authenticated" };

  try {
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
        data: { userId, eventId },
      });

      // 5. NEW: Send Registration Notification
      await tx.notification.create({
        data: {
          userId,
          title: `${event.title}::Registration Confirmed`,
          message: `You have successfully registered for "${event.title}". We will notify you when the meeting link is available.`,
          type: "EVENT",
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
  // try {
  //   // 1. Update Event
  //   const event = await prisma.event.update({
  //     where: { id: eventId },
  //     data: { meetingLink: link },
  //     include: { registrations: true },
  //   });

  //   // 2. Send Notification to ALL Registrants
  //   // We use createMany to be efficient
  //   if (event.registrations.length > 0) {
  //     await prisma.notification.createMany({
  //       data: event.registrations.map((reg) => ({
  //         userId: reg.userId,
  //         title: "Meeting Link Added",
  //         message: `The link for "${event.title}" has been updated. Click to join.`,
  //         type: "EVENT",
  //         link: link,
  //       })),
  //     });
  //   }

  //   revalidatePath("/admin/events");
  //   return { success: true };
  // } catch (error) {
  //   console.error(error);
  //   return { success: false };
  // }
  try {
    const event = await prisma.event.update({
      where: { id: eventId },
      data: { meetingLink: link },
      include: { registrations: true },
    });

    if (event.registrations.length > 0) {
      await prisma.notification.createMany({
        data: event.registrations.map((reg) => ({
          userId: reg.userId,
          // UPDATE THIS LINE to include the Event title:
          title: `${event.title}::Meeting Link Added`,
          message: `The link for "${event.title}" has been updated. Click the button below to join.`,
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

// --- RECRUITER AI & INTERVIEW ACTIONS ---

export async function generateApplicantScore(applicationId: string) {
  try {
    // 1. Fetch all data needed for Gemini to make a decision
    const app = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: true,
        user: {
          include: {
            enrollments: { include: { course: true, completedLessons: true } },
          },
        },
      },
    });

    if (!app) return { success: false };

    // 2. Format the student's Castpotro DNA
    const courses = app.user.enrollments
      .map(
        (e) => `${e.course.title} (${e.completedLessons.length} lessons done)`,
      )
      .join(", ");
    const candidateProfile = `
      Name: ${app.user.name}
      Total Impact XP: ${app.user.xp}
      Courses Taken: ${courses || "None yet"}
      Screening Submission: ${app.submissionLink || "None provided"}
    `;

    const jobProfile = `
      Role: ${app.job.role} at ${app.job.company}
      Requirements: ${app.job.screeningPrompt || "Standard application"}
    `;

    // 3. Ask Gemini for a Match Score (0 to 100)
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
    const prompt = `
      You are an expert technical recruiter. Evaluate this candidate against the job.
      Return ONLY a single number from 0 to 100 representing the match percentage. Do not include a % symbol or any other text.
      
      Job Details: ${jobProfile}
      Candidate DNA: ${candidateProfile}
    `;

    const result = await model.generateContent(prompt);
    const scoreText = result.response.text().trim();
    const score = parseFloat(scoreText);

    if (isNaN(score)) throw new Error("Gemini returned invalid score format");

    // 4. Save the score to the database
    await prisma.application.update({
      where: { id: applicationId },
      data: { aiMatchScore: score },
    });

    revalidatePath(`/admin/jobs/${app.jobId}`);
    return { success: true, score };
  } catch (error) {
    console.error("AI Scoring Error:", error);
    return { success: false };
  }
}

// interview invite action, we will send a notification to the user with the interview details and a link to the meeting. We will also update the application status to "INTERVIEW_SCHEDULED". The recruiter can input a date string like "Oct 24th at 3:00 PM" and we will parse it to extract the date and time for the notification message.
export async function sendInterviewInvite(
  applicationId: string,
  meetingLink: string,
  date: string,
) {
  try {
    const app = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true },
    });
    if (!app) return { success: false };

    await prisma.application.update({
      where: { id: applicationId },
      data: { status: "INTERVIEW_SCHEDULED" },
    });

    const datePart = date.includes(" at ") ? date.split(" at ")[0] : date;
    const timePart = date.includes(" at ") ? date.split(" at ")[1] : "TBD";

    await prisma.notification.create({
      data: {
        userId: app.userId,
        title: `${app.job.role}::Interview Invite`,
        message: `You have been invited to an interview for the position of ${app.job.role}.\n\nDate: ${datePart}\nTime: ${timePart}\n\nPlease click the button below to join the meeting at the scheduled time.`,
        type: "JOB",
        link: meetingLink, // This automatically renders the "Open Link" button on the frontend
      },
    });

    revalidatePath(`/admin/jobs/${app.jobId}`);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

// --- NOTIFICATION ACTIONS ---

export async function markNotificationAsRead(notificationId: string) {
  try {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
    // We don't need to revalidate path here if we handle state on the client,
    // but it's good practice to ensure the server knows.
    return { success: true };
  } catch (error) {
    console.error("Failed to mark as read:", error);
    return { success: false };
  }
}
