import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { getUserImpactDNA } from "@/app/actions/quests";
import QuestsClient from "./QuestsClient"; // <--- We will rename your previous "QuestsPage" to this

export default async function QuestsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  
  // 1. Fetch DNA Stats
  const dna = userId ? await getUserImpactDNA(userId) : {};

  // 2. Fetch Active Quests
  const quests = await prisma.quest.findMany({
    where: { isActive: true },
  });

  // 3. Fetch User Submissions (To know status)
  const userSubmissions = userId ? await prisma.questSubmission.findMany({
    where: { userId },
    select: { questId: true, status: true }
  }) : [];

  return (
    <QuestsClient 
      quests={quests} 
      dna={dna} 
      userSubmissions={userSubmissions} 
    />
  );
}