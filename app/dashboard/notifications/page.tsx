// app/dashboard/notifications/page.tsx
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import NotificationsClient from "./NotificationsClient";

export default async function NotificationsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    // Change max-w-2xl or max-w-3xl to max-w-5xl or max-w-full
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">
          Notifications
        </h1>
        <p className="text-slate-500 font-medium">
          Stay updated with your applications, events, and achievements.
        </p>
      </div>
      
      <NotificationsClient initialNotifications={notifications} />
    </div>
  );
}