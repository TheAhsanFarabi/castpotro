"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// --- PURCHASE CASTPOTRO PLUS (Deduct Coins Only) ---
export async function purchasePlusAction(cost: number) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) return { success: false, message: "Not authenticated" };

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { success: false, message: "User not found" };

    if (user.coins < cost) {
      return { success: false, message: "Insufficient coins!" };
    }

    // Deduct coins
    await prisma.user.update({
      where: { id: userId },
      data: {
        coins: { decrement: cost },
      },
    });

    revalidatePath("/dashboard");
    return { success: true, message: "Purchase successful!" };
  } catch (error) {
    console.error("Plus purchase error:", error);
    return { success: false, message: "Transaction failed." };
  }
}

// --- REFILL COINS (Add Coins) ---
export async function refillCoinsAction(amount: number) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) return { success: false, message: "Not authenticated" };

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        coins: { increment: amount },
      },
    });

    revalidatePath("/dashboard");
    return { success: true, message: `Successfully added ${amount} coins!` };
  } catch (error) {
    console.error("Refill error:", error);
    return { success: false, message: "Refill failed." };
  }
}