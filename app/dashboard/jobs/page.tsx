import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import JobsClient from "./JobsClient";

export default async function JobsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  // 1. Fetch Open Jobs
  const jobsRaw = await prisma.job.findMany({
    where: { isOpen: true },
    orderBy: { createdAt: 'desc' }
  });

  // 2. Fetch User Info (Applications & Enrollments with Progress)
  const user = userId ? await prisma.user.findUnique({
    where: { id: userId },
    include: {
      applications: { select: { jobId: true } },
      enrollments: { 
        include: { 
          completedLessons: true // Needed to count progress
        } 
      }
    }
  }) : null;

  const userApplications = user?.applications.map(app => app.jobId) || [];

  // 3. Fetch All Courses (To check total lessons count & get titles)
  const courses = await prisma.course.findMany({
    include: {
      units: { 
        include: { lessons: true } 
      }
    }
  });

  // 4. LOGIC: Calculate which courses are fully completed
  const completedCourses: string[] = [];
  
  if (user) {
    for (const enrollment of user.enrollments) {
      const course = courses.find(c => c.id === enrollment.courseId);
      
      if (course) {
        // Calculate Total Lessons in the Course
        const totalLessons = course.units.reduce((acc, unit) => acc + unit.lessons.length, 0);
        
        // Calculate Lessons Completed by User
        const completedCount = enrollment.completedLessons.length;

        // If User completed all lessons, mark course as complete
        if (totalLessons > 0 && completedCount >= totalLessons) {
          completedCourses.push(course.id);
        }
      }
    }
  }

  // 5. Enrich Jobs Data for the UI
  const jobs = jobsRaw.map(job => {
    // Find the title of the required course
    const reqCourse = courses.find(c => c.id === job.requiredCourse);
    
    // Simple "Posted X days ago" logic
    const diff = new Date().getTime() - new Date(job.createdAt).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const posted = days === 0 ? "Today" : `${days}d ago`;

    // Assign generic colors based on ID length or random logic (optional UI flair)
    const colors = ["bg-emerald-500", "bg-blue-500", "bg-purple-500", "bg-rose-500", "bg-orange-500"];
    const colorIndex = job.id.charCodeAt(job.id.length - 1) % colors.length;

    return {
      ...job,
      requiredCourseName: reqCourse ? reqCourse.title : "Unknown Course",
      posted: posted,
      color: colors[colorIndex] 
    };
  });

  return (
    <JobsClient 
      jobs={jobs} 
      userApplications={userApplications} 
      completedCourses={completedCourses} 
    />
  );
}