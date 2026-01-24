import { prisma } from "@/lib/prisma";
import EditEventForm from "./EditEventForm"; // Import the client form

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  // 1. Fetch Data on the Server
  const event = await prisma.event.findUnique({ where: { id: eventId } });

  if (!event) return <div>Event not found</div>;

  // 2. Pass Data to Client Component
  return <EditEventForm event={event} />;
}
