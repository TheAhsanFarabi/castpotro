import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import NotificationsClient from "./NotificationsClient";

export default async function NotificationsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) redirect("/login");

  // Fetch all notifications for this user, newest first
  const notifications = await prisma.notification.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
    take: 50, // Limit to the most recent 50 notifications
  });

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-800">Notifications</h1>
        <p className="text-slate-500 font-medium mt-1">
          Stay updated on your career and course progress.
        </p>
      </div>

      {/* Render the Gmail-style client component */}
      <NotificationsClient initialNotifications={notifications} />
    </div>
  );
}
