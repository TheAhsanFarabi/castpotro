"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

// 1. SAVE NOTE
export async function saveNote(lessonId: string, content: string) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) return { success: false, message: "Unauthorized" };

  try {
    await prisma.note.upsert({
      where: {
        userId_lessonId: { userId, lessonId }
      },
      update: { content },
      create: {
        userId,
        lessonId,
        content
      }
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to save note", error);
    return { success: false };
  }
}

// 2. GET NOTE
export async function getNote(lessonId: string) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) return null;

  const note = await prisma.note.findUnique({
    where: { userId_lessonId: { userId, lessonId } }
  });

  return note ? note.content : null;
}