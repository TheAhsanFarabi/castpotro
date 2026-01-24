import { prisma } from "@/lib/prisma";
import EditQuestForm from "./EditQuestForm";

export default async function EditQuestPage({
  params,
}: {
  params: Promise<{ questId: string }>;
}) {
  const { questId } = await params;

  // 1. Fetch Data
  const quest = await prisma.quest.findUnique({ where: { id: questId } });

  if (!quest) return <div>Quest not found</div>;

  // 2. Pass to Client Form
  return <EditQuestForm quest={quest} />;
}
