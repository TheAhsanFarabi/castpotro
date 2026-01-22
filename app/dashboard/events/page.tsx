// app/dashboard/events/page.tsx
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import EventsClient from "./EventsClient"; // We will create this client component

export default async function EventsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  const events = await prisma.event.findMany({
    where: { date: { gte: new Date() } }, // Only future events
    orderBy: { date: 'asc' },
    include: {
      registrations: {
        where: { userId: userId }, // Check if THIS user registered
      }
    }
  });

  // Transform for client
  const eventsData = events.map(e => ({
    ...e,
    isRegistered: e.registrations.length > 0
  }));

  return <EventsClient events={eventsData} />;
}