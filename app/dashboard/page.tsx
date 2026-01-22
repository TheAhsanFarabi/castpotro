import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) {
    redirect('/login');
  }

  // Fetch Current User & Enrollments with deep completion status
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      enrollments: {
        include: {
          completedLessons: true 
        }
      },
    },
  });

  if (!user) {
    redirect('/login');
  }

  // Fetch All Courses with Structure (Units and Lessons)
  const courses = await prisma.course.findMany({
    include: {
      units: {
        orderBy: { order: 'asc' },
        include: {
          lessons: true
        }
      }
    }
  });

  return <DashboardClient user={user} courses={courses} />;
}