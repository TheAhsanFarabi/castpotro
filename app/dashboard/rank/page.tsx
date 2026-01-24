import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserStreak, getWeeklyXP } from "@/app/actions/quests"; // Import getWeeklyXP
import RankClient from "./RankClient";

export default async function RankPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    redirect("/login");
  }

  // Fetch all data in parallel
  const [leaderboard, currentUser, streakData, weeklyXP] = await Promise.all([
    // 1. Leaderboard
    prisma.user.findMany({
      where: { role: "USER" },
      orderBy: { xp: "desc" },
      take: 50,
      select: {
        id: true,
        name: true,
        xp: true,
        avatarConfig: true,
      },
    }),

    // 2. Current User
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, xp: true, coins: true },
    }),

    // 3. Streak
    getUserStreak(userId),

    // 4. 👇 Weekly XP (Real Data)
    getWeeklyXP(userId),
  ]);

  if (!currentUser) {
    redirect("/login");
  }

  return (
    <RankClient
      leaderboard={leaderboard}
      currentUser={currentUser}
      streak={streakData.streak}
      weeklyXP={weeklyXP} // Pass to client
    />
  );
}
