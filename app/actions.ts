'use server'

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
    cookieStore.set("userId", user.id, { httpOnly: true, path: '/' });

    // CRITICAL CHANGE: We return success instead of redirecting.
    // This allows the Client Component to show the Confetti first.
    return { success: true, message: "Account created successfully!" };

  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}

// --- 2. LOGIN ACTION (Standard Redirect) ---
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
    cookieStore.set("userId", user.id, { httpOnly: true, path: '/' });

  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Something went wrong." };
  }

  // Redirect happens here (no confetti needed for login usually)
  redirect("/dashboard");
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
It does NOT guarantee jobs.
It focuses on skill growth, proof of learning, and credibility.
`;

export async function chatWithGemini(
  history: { role: "user" | "ai"; text: string }[],
  message: string
) {
  try {
    // Using 'gemini-1.5-flash' as it is the standard stable model for this SDK.
    // If you have access to newer previews, you can change this string.
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", 
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
    let formattedHistory = history.map(msg => ({
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