import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // --- 1. CLEANUP (Order matters for foreign keys) ---
  await prisma.questSubmission.deleteMany();
  await prisma.quest.deleteMany();
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.eventRegistration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.completedLesson.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // --- 2. CREATE A DUMMY INSTRUCTOR ---
  const instructor = await prisma.user.create({
    data: {
      email: "instructor@castpotro.com",
      password: "hashed_password_here",
      name: "Castpotro Mentor",
      role: "INSTRUCTOR",
      bio: "AI Mentor and Course Creator."
    }
  });

  // --- 3. SEED COURSES (With Units & Lessons) ---
  console.log('📚 Seeding Courses...');
  
  const coursesData = [
    {
      title: "Intro to Large Language Models",
      description: "Learn the fundamentals of LLMs, how ChatGPT works, and the future of Generative AI.",
      icon: "BrainCircuit",
      units: {
        create: [
          {
            title: "Basics of LLMs",
            description: "Understanding the transformer architecture.",
            order: 1,
            lessons: {
              create: [
                {
                  title: "What is an LLM?",
                  theory: "Large Language Models are deep learning algorithms that can recognize, summarize, translate, predict and generate text.",
                  videoUrl: "https://www.youtube.com/watch?v=zjkBMFhNj_g"
                },
                {
                  title: "How Transformers Work",
                  theory: "Attention mechanisms allow models to weigh the importance of different words in a sentence.",
                  videoUrl: "https://www.youtube.com/watch?v=4Bdc55j80l8"
                }
              ]
            }
          }
        ]
      }
    },
    {
      title: "The Art of Public Speaking",
      description: "Master the art of persuasion, body language, and overcoming stage fright.",
      icon: "Mic",
      units: {
        create: [
          {
            title: "Confidence & Delivery",
            description: "How to stand and speak.",
            order: 1,
            lessons: {
              create: [
                {
                  title: "Overcoming Stage Fright",
                  theory: "Fear is excitement without breath. Learn to breathe correctly.",
                  videoUrl: "https://www.youtube.com/watch?v=i5mYphUoOCs"
                }
              ]
            }
          }
        ]
      }
    },
    {
      title: "Python for Beginners",
      description: "A complete introduction to Python programming. From variables to building your first app.",
      icon: "Code",
      units: {
        create: [
          {
            title: "Getting Started",
            description: "Setup and Syntax.",
            order: 1,
            lessons: {
              create: [
                {
                  title: "Your First Python Script",
                  theory: "Print('Hello World') is the tradition.",
                  videoUrl: "https://www.youtube.com/watch?v=eWRfhZUzrAc"
                }
              ]
            }
          }
        ]
      }
    },
    {
      title: "Startup 101: Zero to One",
      description: "Legendary lectures on how to build a billion-dollar company.",
      icon: "Rocket",
      units: {
        create: [
          {
            title: "Idea Generation",
            description: "Finding problems worth solving.",
            order: 1,
            lessons: {
              create: [
                {
                  title: "How to Start a Startup",
                  theory: "Build something people want.",
                  videoUrl: "https://www.youtube.com/watch?v=CBYhVcO4Wds"
                }
              ]
            }
          }
        ]
      }
    },
    {
      title: "Communication for Engineers",
      description: "How to communicate complex technical ideas to non-technical stakeholders.",
      icon: "MessageCircle",
      units: {
        create: [
          {
            title: "Soft Skills Basics",
            description: "Empathy and clarity.",
            order: 1,
            lessons: {
              create: [
                {
                  title: "Technical Storytelling",
                  theory: "Don't just list features, tell a story about the user.",
                  videoUrl: "https://www.youtube.com/watch?v=HAnw168huqA"
                }
              ]
            }
          }
        ]
      }
    }
  ];

  for (const c of coursesData) {
    await prisma.course.create({ data: c });
  }

  // --- 4. SEED EVENTS ---
  console.log('📅 Seeding Events...');
  
  const events = [
    {
      title: "AI Summit Dhaka 2026",
      description: "Join the biggest gathering of AI researchers and enthusiasts in Bangladesh.",
      date: new Date('2026-03-15T10:00:00Z'),
      location: "UIU Campus, Dhaka",
      type: "Physical",
      meetingLink: null
    },
    {
      title: "Hult Prize Regional Pitch",
      description: "Pitch your startup idea (ZeroBrick?) to global judges.",
      date: new Date('2026-02-10T14:00:00Z'),
      location: "Online (Zoom)",
      type: "Online",
      meetingLink: "https://zoom.us/j/123456789"
    },
    {
      title: "Mock Interview Workshop",
      description: "Practice your soft skills with industry mentors.",
      date: new Date('2026-01-25T18:00:00Z'),
      location: "Google Meet",
      type: "Workshop",
      meetingLink: "https://meet.google.com/abc-defg-hij"
    }
  ];

  for (const e of events) {
    await prisma.event.create({ data: e });
  }

  // --- 5. SEED QUESTS (Impact/SDG) ---
  console.log('⚔️ Seeding Quests...');
  
  const quests = [
    {
      title: "The Early Bird",
      description: "Login and complete a lesson before 8 AM.",
      xp: 50,
      sdgId: 4, // Quality Education
      frequency: "DAILY",
      verificationType: "TEXT",
      aiPrompt: "Verify the user logged in early."
    },
    {
      title: "Eco Warrior",
      description: "Plant a tree and upload a photo.",
      xp: 500,
      sdgId: 13, // Climate Action
      frequency: "ONCE",
      verificationType: "AI_IMAGE",
      aiPrompt: "Check if the image contains a newly planted tree or sapling."
    },
    {
      title: "Community Helper",
      description: "Teach a friend a new coding concept.",
      xp: 200,
      sdgId: 4,
      frequency: "WEEKLY",
      verificationType: "TEXT",
      aiPrompt: "Analyze the reflection for teaching keywords."
    }
  ];

  for (const q of quests) {
    await prisma.quest.create({ data: q });
  }

  // --- 6. SEED JOBS ---
  console.log('💼 Seeding Jobs...');

  const jobs = [
    {
      role: "Jr. AI Engineer",
      company: "TigerIT",
      location: "Dhaka",
      type: "Full-Time",
      salary: "60k - 80k BDT",
      isPromoted: true
    },
    {
      role: "React Frontend Intern",
      company: "Chaldal",
      location: "Dhaka",
      type: "Internship",
      salary: "15k - 20k BDT",
      isPromoted: false
    },
    {
      role: "Technical Content Writer",
      company: "Remote (Global)",
      location: "Remote",
      type: "Part-Time",
      salary: "$20/hr",
      isPromoted: false
    }
  ];

  for (const j of jobs) {
    await prisma.job.create({ data: j });
  }

  console.log('🚀 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });