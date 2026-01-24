import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserStreak } from "@/app/actions/quests";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    redirect("/login");
  }

  // 1. Fetch Current User
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      enrollments: {
        include: {
          completedLessons: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  // 2. Fetch All Courses
  const courses = await prisma.course.findMany({
    include: {
      units: {
        orderBy: { order: "asc" },
        include: {
          lessons: true,
        },
      },
    },
  });

  // 3. Fetch Streak Data
  const streakData = await getUserStreak(userId);

  // 4. Fetch Leaderboard Data (FILTERED BY ROLE 'USER')
  const leaderboard = await prisma.user.findMany({
    take: 5,
    where: {
      role: "USER", // Only fetch learners
    },
    orderBy: { xp: "desc" },
    select: {
      id: true,
      name: true,
      xp: true,
      avatarConfig: true,
    },
  });

  // 5. Calculate My Real Rank (Compared only against other USERs)
  const higherRankUsers = await prisma.user.count({
    where: {
      role: "USER", // Only count learners with more XP
      xp: { gt: user.xp },
    },
  });
  const myRank = higherRankUsers + 1;

  return (
    <DashboardClient
      user={user}
      courses={courses}
      streakData={streakData}
      leaderboard={leaderboard}
      myRank={myRank}
    />
  );
}
