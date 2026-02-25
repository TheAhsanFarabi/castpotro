import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper to create consistent block structures
const createHeading = (text: string, level: number = 3) => ({
  id: crypto.randomUUID(),
  type: "heading",
  props: { backgroundColor: "default", textColor: "default", textAlignment: "left", level },
  content: [{ type: "text", text, styles: {} }],
  children: [],
});

const createParagraph = (text: string) => ({
  id: crypto.randomUUID(),
  type: "paragraph",
  props: { backgroundColor: "default", textColor: "default", textAlignment: "left" },
  content: [{ type: "text", text, styles: {} }],
  children: [],
});

const createBullet = (text: string) => ({
  id: crypto.randomUUID(),
  type: "bulletListItem",
  props: { backgroundColor: "default", textColor: "default", textAlignment: "left" },
  content: [{ type: "text", text, styles: {} }],
  children: [],
});

const createQuote = (text: string) => ({
  id: crypto.randomUUID(),
  type: "quote",
  props: { backgroundColor: "default", textColor: "default", textAlignment: "left" },
  content: [{ type: "text", text, styles: {} }],
  children: [],
});

async function main() {
  console.log("🌱 Starting Block-Based Seed for Castpotro V2.0...");

  // -----------------------------------------------------------------------
  // 1. CLEANUP
  // -----------------------------------------------------------------------
  const tablenames = [
    "QuestSubmission",
    "Quest",
    "Application",
    "Job",
    "EventRegistration",
    "Event",
    "CompletedLesson",
    "Enrollment",
    "Quiz",
    "Note",
    "Lesson",
    "Unit",
    "Course",
  ];

  for (const tableName of tablenames) {
    try {
      await prisma.$executeRawUnsafe(`DELETE FROM ${tableName};`);
    } catch (error) {
      console.log(`⚠️ Could not clear table ${tableName}, continuing...`);
    }
  }

  // -----------------------------------------------------------------------
  // 2. CREATE INSTRUCTOR
  // -----------------------------------------------------------------------
  let instructor = await prisma.user.findFirst({ where: { role: "INSTRUCTOR" } });
  if (!instructor) {
    instructor = await prisma.user.create({
      data: {
        email: "mentor@castpotro.com",
        password: "$2a$10$kp1V7UY.4.5...hashed_password_placeholder",
        name: "Castpotro Master Mentor",
        role: "INSTRUCTOR",
        bio: "AI Specialist & Soft Skills Coach.",
        xp: 9999,
        coins: 5000,
      },
    });
  }
  const instructorId = instructor.id;

  // -----------------------------------------------------------------------
  // 3. SEED COURSES (With JSON Block Theory)
  // -----------------------------------------------------------------------

  // --- COURSE 1: COMMUNICATION SKILLS ---
  console.log("📘 Seeding Course: Communication...");
  const commCourse = await prisma.course.create({
    data: {
      title: "Masterful Communication: Beyond Words",
      description: "Master active listening, negotiation, and body language.",
      icon: "MessageSquare",
      creatorId: instructorId,
      units: {
        create: [
          {
            title: "Unit 1: The Psychology of Active Listening",
            description: "Stop waiting to speak; start listening.",
            order: 1,
            lessons: {
              create: [
                {
                  title: "Mirroring & Labeling",
                  // JSON BLOCK THEORY
                  theory: JSON.stringify([
                    createHeading("The Science of Connection", 2),
                    createParagraph("Most people listen with the intent to reply, not to understand. Mirroring is the art of repeating the last 3 words your counterpart said."),
                    createHeading("Scenario", 3),
                    createQuote("Your boss says: 'I'm really worried about the Q3 timeline.'\n\nBad Reply: 'Don't worry, we'll work harder.'\n\nMirroring Reply: 'The Q3 timeline?'\n\nResult: This forces them to elaborate on the root cause."),
                    createParagraph("This technique builds rapport instantly and gathers more information without asking 20 questions."),
                  ]),
                  videoUrl: "https://www.youtube.com/watch?v=4VOubVB4CTM",
                  questions: {
                    create: [
                      { question: "What is the primary goal of 'Mirroring'?", options: ["To mock the speaker", "To encourage elaboration", "To end the conversation", "To show off memory"], correct: 1 },
                      { question: "In the scenario, why is 'The Q3 timeline?' a better response?", options: ["It provides a solution", "It dismisses the worry", "It invites the speaker to explain the root cause", "It changes the subject"], correct: 2 },
                      { question: "Active listening requires you to suppress the urge to:", options: ["Make eye contact", "Formulate your reply while they speak", "Nod your head", "Take notes"], correct: 1 }
                    ]
                  }
                }
              ]
            }
          },
          {
            title: "Unit 2: Non-Verbal Mastery",
            description: "Reading the room before you say a word.",
            order: 2,
            lessons: {
              create: [{
                title: "Body Language Decoded",
                theory: JSON.stringify([
                  createHeading("The 7-38-55 Rule", 2),
                  createParagraph("Communication is 7% spoken words, 38% tone of voice, and 55% body language."),
                  createHeading("Key Signals", 3),
                  createBullet("Crossed Arms: Often defensive, but sometimes just deep thought."),
                  createBullet("Leaning In: Indicates engagement and interest."),
                  createBullet("Feet Direction: We point our feet where we want to go (often towards the door if bored)."),
                ]),
                questions: {
                  create: [
                    { question: "What percentage of communication is body language according to the rule?", options: ["7%", "38%", "55%", "90%"], correct: 2 },
                    { question: "If someone points their feet towards the door, they likely want to:", options: ["Stay longer", "Leave", "Dance", "Argue"], correct: 1 },
                    { question: "Crossed arms always mean anger.", options: ["True", "False"], correct: 1 }
                  ]
                }
              }]
            }
          },
          {
            title: "Unit 3: Conflict Resolution",
            description: "De-escalating tension.",
            order: 3,
            lessons: {
              create: [{
                title: "The 'I' Statement",
                theory: JSON.stringify([
                  createHeading("Reducing Defensiveness", 2),
                  createParagraph("Accusatory language ('You messed up') triggers fight-or-flight."),
                  createQuote("Formula: I feel [Emotion] when [Action] because [Reason]."),
                  createParagraph("Example: 'I feel stressed when deadlines are missed because it affects the whole team,' instead of 'You are lazy.'"),
                ]),
                questions: {
                  create: [
                    { question: "Why avoid 'You' statements in conflict?", options: ["They sound polite", "They cause defensiveness", "They are too short", "They are grammatically incorrect"], correct: 1 },
                    { question: "The goal of conflict resolution is:", options: ["To win the argument", "To find a mutual solution", "To prove the other person wrong", "To avoid talking"], correct: 1 },
                    { question: "What follows 'I feel' in the formula?", options: ["Your opinion", "An emotion", "An insult", "A fact"], correct: 1 }
                  ]
                }
              }]
            }
          },
          {
            title: "Unit 4: Negotiation Basics",
            description: "Getting to 'Yes'.",
            order: 4,
            lessons: {
              create: [{
                title: "BATNA",
                theory: JSON.stringify([
                  createHeading("Best Alternative to a Negotiated Agreement", 2),
                  createParagraph("Your BATNA is your backup plan. It gives you the power to walk away."),
                  createBullet("Strong BATNA: You have another job offer."),
                  createBullet("Weak BATNA: You are desperate for this deal."),
                  createParagraph("Never reveal your BATNA unless it helps you."),
                ]),
                questions: {
                  create: [
                    { question: "What does BATNA stand for?", options: ["Best Alternative to a Negotiated Agreement", "Better Ask The New Admin", "Basic Action To Negotiate Assets", "Big Amount To Negotiate Always"], correct: 0 },
                    { question: "If your BATNA is strong, you have:", options: ["Less power", "More leverage", "No options", "More fear"], correct: 1 },
                    { question: "Should you always reveal your BATNA?", options: ["Yes", "No", "Only if asked", "Only to friends"], correct: 1 }
                  ]
                }
              }]
            }
          },
          {
            title: "Unit 5: Public Speaking",
            description: "Capturing hearts and minds.",
            order: 5,
            lessons: {
              create: [{
                title: "The Hero's Journey",
                theory: JSON.stringify([
                  createHeading("Audience is the Hero", 2),
                  createParagraph("In any presentation, you are not the hero (Luke Skywalker). You are the guide (Yoda)."),
                  createParagraph("Your job is to give the audience a plan to solve their problem and achieve success."),
                  createQuote("Structure: Problem -> Guide (You) -> Plan -> Call to Action -> Success."),
                ]),
                questions: {
                  create: [
                    { question: "Who is the 'Hero' in a business presentation?", options: ["The Presenter", "The Product", "The Audience", "The CEO"], correct: 2 },
                    { question: "What is your role as the presenter?", options: ["The Villain", "The Victim", "The Guide", "The Hero"], correct: 2 },
                    { question: "To reduce stage fright, focus on:", options: ["Your appearance", "The value you are giving", "The silence", "Your trembling hands"], correct: 1 }
                  ]
                }
              }]
            }
          }
        ]
      }
    }
  });

  // --- COURSE 2: LEADERSHIP ---
  console.log("🛡️ Seeding Course: Leadership...");
  const leadershipCourse = await prisma.course.create({
    data: {
      title: "Adaptive Leadership",
      description: "Lead through volatility, uncertainty, complexity, and ambiguity (VUCA).",
      icon: "ShieldCheck",
      creatorId: instructorId,
      units: {
        create: [
          {
            title: "Unit 1: Situational Leadership",
            description: "Directing vs. Delegating.",
            order: 1,
            lessons: {
              create: [{
                title: "Matching Style to Competence",
                theory: JSON.stringify([
                  createHeading("One Size Does Not Fit All", 2),
                  createParagraph("Different employees need different management styles based on their competence and commitment."),
                  createBullet("Directing: High guidance for beginners."),
                  createBullet("Coaching: High guidance + support for disillusioned learners."),
                  createBullet("Supporting: Low guidance + high support for capable but cautious workers."),
                  createBullet("Delegating: Low guidance + low support for experts."),
                ]),
                questions: {
                  create: [
                    { question: "What style suits a highly skilled, motivated employee?", options: ["Directing", "Coaching", "Supporting", "Delegating"], correct: 3 },
                    { question: "Micro-managing a senior employee usually results in:", options: ["Higher productivity", "Disengagement", "Better code", "Promotion"], correct: 1 },
                    { question: "Situational leadership depends on:", options: ["The leader's mood", "The follower's competence and commitment", "The time of day", "Company policy"], correct: 1 }
                  ]
                }
              }]
            }
          },
          {
            title: "Unit 2: Emotional Intelligence",
            description: "Self-Regulation.",
            order: 2,
            lessons: {
              create: [{
                title: "The Emotional Thermostat",
                theory: JSON.stringify([
                  createHeading("Leaders Set the Tone", 2),
                  createParagraph("A leader's mood is contagious. If you are anxious, the team is anxious."),
                  createQuote("Self-Regulation Strategy: The 'Stop-Challenge-Choose' method. Stop the reaction, Challenge the thought, Choose the response."),
                ]),
                questions: {
                  create: [
                    { question: "If a leader panics during a crisis, the team will likely:", options: ["Step up", "Panic as well", "Laugh", "Ignore it"], correct: 1 },
                    { question: "What is the 'Stop-Challenge-Choose' method used for?", options: ["Project management", "Self-regulation", "Hiring", "Firing"], correct: 1 },
                    { question: "Empathy involves:", options: ["Agreeing with everyone", "Understanding others' feelings", "Fixing everyone's problems", "Crying frequently"], correct: 1 }
                  ]
                }
              }]
            }
          },
          { title: "Unit 3: Strategic Vision", description: "Defining the 'Why'.", order: 3, lessons: { create: [{ title: "Vision vs Mission", theory: JSON.stringify([createHeading("Definitions", 2), createParagraph("Vision is the destination (Where are we going?). Mission is the vehicle (How do we get there?).")]), questions: { create: [{ question: "Vision is:", options: ["The Future", "The Past", "The Daily Tasks", "The Budget"], correct: 0 }, { question: "A good vision statement is:", options: ["Long and complex", "Inspiring and clear", "Secret", "Profit-focused"], correct: 1 }, { question: "Who sets the vision?", options: ["HR", "Leadership", "Interns", "Customers"], correct: 1 }] } }] } },
          { title: "Unit 4: Team Dynamics", description: "Psychological Safety.", order: 4, lessons: { create: [{ title: "Project Aristotle", theory: JSON.stringify([createHeading("Google's Findings", 2), createParagraph("Google found that the #1 factor in high-performing teams was Psychological Safety."), createQuote("The belief that you won't be punished for making a mistake.")]), questions: { create: [{ question: "Psychological safety allows teams to:", options: ["Hide mistakes", "Admit mistakes and learn", "Avoid work", "Bully others"], correct: 1 }, { question: "Google's Project Aristotle studied:", options: ["Search algorithms", "Team effectiveness", "Ads", "Hardware"], correct: 1 }, { question: "To build safety, a leader should:", options: ["Punish failure", "Model vulnerability", "Know all answers", "Never apologize"], correct: 1 }] } }] } },
          { title: "Unit 5: Leading Change", description: "Adoption Curve.", order: 5, lessons: { create: [{ title: "Early Adopters", theory: JSON.stringify([createHeading("The Diffusion of Innovation", 2), createParagraph("Don't waste energy on laggards. Focus on the Innovators and Early Adopters to build momentum.")]), questions: { create: [{ question: "Who should you target first when driving change?", options: ["Laggards", "Early Adopters", "The Majority", "Resisters"], correct: 1 }, { question: "Resistance to change is usually caused by:", options: ["Laziness", "Fear of the unknown", "Stupidity", "Bad weather"], correct: 1 }, { question: "Change management requires:", options: ["Communication", "Secrecy", "Force", "Luck"], correct: 0 }] } }] } }
        ]
      }
    }
  });

  // --- COURSE 3: PROMPT ENGINEERING ---
  console.log("🤖 Seeding Course: Prompt Engineering...");
  const promptCourse = await prisma.course.create({
    data: {
      title: "Prompt Engineering Essentials",
      description: "Learn the systematic approach to controlling LLMs like Gemini and GPT-4.",
      icon: "Terminal",
      creatorId: instructorId,
      units: {
        create: [
          {
            title: "Unit 1: The Persona Pattern",
            description: "Role-playing with AI.",
            order: 1,
            lessons: {
              create: [{
                title: "Act as a...",
                theory: JSON.stringify([
                  createHeading("Context Setting", 2),
                  createParagraph("Assigning a persona limits the search space of the model to relevant professional knowledge."),
                  createQuote("Scenario: asking for 'Legal Advice' vs 'Acting as a NY Corporate Lawyer' yields vastly different results."),
                ]),
                questions: {
                  create: [
                    { question: "What does the Persona Pattern do?", options: ["Speeds up the AI", "Sets the context and tone", "Saves money", "Translates to French"], correct: 1 },
                    { question: "Which prompt is better for legal advice?", options: ["Tell me about law", "Act as a Corporate Lawyer...", "Is this illegal?", "Help me"], correct: 1 },
                    { question: "Personas help reduce:", options: ["Accuracy", "Generic answers", "Creativity", "Speed"], correct: 1 }
                  ]
                }
              }]
            }
          },
          { title: "Unit 2: Chain of Thought", description: "Reasoning step-by-step.", order: 2, lessons: { create: [{ title: "CoT Prompting", theory: JSON.stringify([createHeading("Zero-Shot CoT", 2), createParagraph("Simply adding 'Let's think step by step' forces the model to generate a reasoning trace before the final answer.")]), questions: { create: [{ question: "CoT stands for:", options: ["Call of Time", "Chain of Thought", "Circle of Trust", "Code of Text"], correct: 1 }, { question: "CoT is most useful for:", options: ["Creative writing", "Complex logic/math", "Simple greetings", "Translation"], correct: 1 }, { question: "Zero-shot CoT uses the phrase:", options: ["Think carefully", "Let's think step by step", "Be smart", "Solve this"], correct: 1 }] } }] } },
          { title: "Unit 3: Few-Shot Prompting", description: "Teaching by example.", order: 3, lessons: { create: [{ title: "Providing Examples", theory: JSON.stringify([createHeading("The Power of Examples", 2), createParagraph("Instead of explaining abstract rules, provide 3 examples of Input -> Desired Output. This is often more effective than long instructions.")]), questions: { create: [{ question: "Few-Shot prompting provides:", options: ["No examples", "Examples of desired output", "Only instructions", "Random text"], correct: 1 }, { question: "One-Shot means:", options: ["Providing 1 example", "Trying only once", "Firing a gun", "Using one word"], correct: 0 }, { question: "Few-Shot is better than Zero-Shot for:", options: ["Specific formatting tasks", "General knowledge", "Greetings", "Summarizing"], correct: 0 }] } }] } },
          { title: "Unit 4: Hallucinations", description: "Managing truth.", order: 4, lessons: { create: [{ title: "Grounding", theory: JSON.stringify([createHeading("Reducing Errors", 2), createParagraph("To stop hallucinations, instruct the model: 'Answer ONLY using the provided text. If you do not know, say you do not know.'")]), questions: { create: [{ question: "How can you reduce hallucinations?", options: ["Ask it to guess", "Restrict it to provided source text", "Ask open ended questions", "Increase temperature"], correct: 1 }, { question: "A 'token' is roughly:", options: ["1 word", "0.75 words", "1 sentence", "1 letter"], correct: 1 }, { question: "If context is full, the AI:", options: ["Learns more", "Forgets earlier info", "Crashes", "Explodes"], correct: 1 }] } }] } },
          { title: "Unit 5: Advanced Workflows", description: "Iterative Refinement.", order: 5, lessons: { create: [{ title: "Refiner Pattern", theory: JSON.stringify([createHeading("Critique Loop", 2), createParagraph("Ask the AI to generate a draft, then ask it to critique its own draft against specific criteria, then rewrite it.")]), questions: { create: [{ question: "Iterative prompting means:", options: ["Asking once", "Refining the output repeatedly", "Copy pasting", "Using multiple AIs"], correct: 1 }, { question: "You can ask AI to:", options: ["Critique its own output", "Cook dinner", "Predict the lottery", "Feel emotions"], correct: 0 }, { question: "RAG stands for:", options: ["Really Advanced Generation", "Retrieval-Augmented Generation", "Random AI Generator", "Read All Google"], correct: 1 }] } }] } }
        ]
      }
    }
  });

  // --- COURSE 4: CRITICAL THINKING ---
  console.log("brain Seeding Course: Critical Thinking...");
  const criticalCourse = await prisma.course.create({
    data: {
      title: "Critical Thinking & Logic",
      description: "Spot fallacies and check biases.",
      icon: "Brain",
      creatorId: instructorId,
      units: {
        create: [
          {
            title: "Unit 1: Logical Fallacies",
            description: "Flaws in arguments.",
            order: 1,
            lessons: {
              create: [{
                title: "Ad Hominem",
                theory: JSON.stringify([
                  createHeading("Attacking the Person", 2),
                  createParagraph("Ad Hominem is rejecting an argument based on who is saying it, rather than the facts."),
                  createHeading("Strawman", 3),
                  createParagraph("Misrepresenting an opponent's argument to make it easier to defeat."),
                ]),
                questions: {
                  create: [
                    { question: "Attacking the speaker instead of the argument is:", options: ["Ad Hominem", "Strawman", "Red Herring", "Slippery Slope"], correct: 0 },
                    { question: "Exaggerating someone's point to mock it is:", options: ["Steelmanning", "Strawmanning", "Gaslighting", "Validating"], correct: 1 },
                    { question: "Logical fallacies make arguments:", options: ["Stronger", "Invalid/Weak", "Louder", "Faster"], correct: 1 }
                  ]
                }
              }]
            }
          },
          { title: "Unit 2: Cognitive Biases", description: "Mental bugs.", order: 2, lessons: { create: [{ title: "Confirmation Bias", theory: JSON.stringify([createHeading("Seeking Validation", 2), createParagraph("We naturally seek information that confirms what we already believe and ignore contradicting evidence.")]), questions: { create: [{ question: "Confirmation bias leads to:", options: ["Objective truth", "Echo chambers", "Scientific discovery", "Unbiased news"], correct: 1 }, { question: "To fight confirmation bias, you should:", options: ["Seek disconfirming evidence", "Trust your gut", "Ask friends who agree", "Stop reading"], correct: 0 }, { question: "The Sunk Cost Fallacy is about:", options: ["Future investment", "Past investment affecting future decisions", "Buying boats", "Saving money"], correct: 1 }] } }] } },
          { title: "Unit 3: First Principles", description: "Deconstruction.", order: 3, lessons: { create: [{ title: "Boiling it Down", theory: JSON.stringify([createHeading("First Principles Thinking", 2), createParagraph("Break a problem down to its fundamental truths and reason up from there, rather than reasoning by analogy (copying others).")]), questions: { create: [{ question: "First Principles thinking involves:", options: ["Copying others", "Deconstructing to basics", "Guessing", "Voting"], correct: 1 }, { question: "Reasoning by analogy is:", options: ["Innovative", "Doing what others do", "Scientific", "Hard"], correct: 1 }, { question: "Who is famous for using First Principles?", options: ["Elon Musk", "Aristotle", "Both", "Neither"], correct: 2 }] } }] } },
          { title: "Unit 4: Data Literacy", description: "Correlation != Causation.", order: 4, lessons: { create: [{ title: "Misleading Graphs", theory: JSON.stringify([createHeading("Visual Lies", 2), createParagraph("Be wary of graphs with truncated Y-axes. They exaggerate small differences to look massive.")]), questions: { create: [{ question: "If A and B happen together, does A cause B?", options: ["Yes, always", "No, correlation is not causation", "Maybe", "Never"], correct: 1 }, { question: "A truncated Y-axis can:", options: ["Save space", "Exaggerate trends", "Hide data", "Make data accurate"], correct: 1 }, { question: "Sample size matters because:", options: ["Small samples are unreliable", "Big samples are expensive", "It doesn't matter", "Math is hard"], correct: 0 }] } }] } },
          { title: "Unit 5: Decision Models", description: "10-10-10 Rule.", order: 5, lessons: { create: [{ title: "Time Perspective", theory: JSON.stringify([createHeading("The 10-10-10 Rule", 2), createParagraph("Ask: How will I feel about this in 10 minutes? 10 months? 10 years? This shifts perspective from short-term emotion to long-term value.")]), questions: { create: [{ question: "The 10-10-10 rule helps with:", options: ["Short-term perspective", "Long-term perspective", "Regret minimization", "All of the above"], correct: 3 }, { question: "Opportunity cost is:", options: ["The price of a product", "What you give up when choosing something else", "Free money", "Tax"], correct: 1 }, { question: "Analysis Paralysis means:", options: ["Thinking too much and doing nothing", "Being paralyzed physically", "Analyzing data quickly", "Writing reports"], correct: 0 }] } }] } }
        ]
      }
    }
  });

  // --- COURSE 5: WEB DEVELOPMENT ---
  console.log("💻 Seeding Course: Web Development...");
  const webCourse = await prisma.course.create({
    data: {
      title: "Modern Web: Next.js 15",
      description: "Fullstack development with App Router & Prisma.",
      icon: "CodeXml",
      creatorId: instructorId,
      units: {
        create: [
          {
            title: "Unit 1: App Router",
            description: "Server vs Client.",
            order: 1,
            lessons: {
              create: [{
                title: "Server Components",
                theory: JSON.stringify([
                  createHeading("Default Behavior", 2),
                  createParagraph("In Next.js 15, everything is a Server Component by default. They run on the server and send HTML to the client."),
                  createQuote("Use 'use client' only when you need interactivity like onClick or useState."),
                ]),
                questions: {
                  create: [
                    { question: "What is the default component type in App Router?", options: ["Client", "Server", "Hybrid", "Static"], correct: 1 },
                    { question: "When do you need 'use client'?", options: ["For fetching data", "For database calls", "For interactivity/hooks", "For SEO"], correct: 2 },
                    { question: "Server components run on:", options: ["The Browser", "The Server", "The CDN", "The Phone"], correct: 1 }
                  ]
                }
              }]
            }
          },
          { title: "Unit 2: Tailwind CSS", description: "Utility-first.", order: 2, lessons: { create: [{ title: "Flexbox", theory: JSON.stringify([createHeading("Layouts", 2), createParagraph("Use 'flex justify-center items-center' to perfectly center content. No more CSS headaches.")]), questions: { create: [{ question: "What does 'justify-center' do in flex row?", options: ["Vertical center", "Horizontal center", "Stretch", "Hide"], correct: 1 }, { question: "Tailwind is:", options: ["A component library", "A utility-first CSS framework", "A database", "A JavaScript framework"], correct: 1 }, { question: "What is the class for padding?", options: ["m-4", "p-4", "pad-4", "space-4"], correct: 1 }] } }] } },
          { title: "Unit 3: Prisma ORM", description: "Database management.", order: 3, lessons: { create: [{ title: "Schema", theory: JSON.stringify([createHeading("Type-Safe Database", 2), createParagraph("Define models in schema.prisma. Run 'npx prisma generate' to create the client based on your schema.")]), questions: { create: [{ question: "What is Prisma?", options: ["A database", "An ORM", "A frontend framework", "A language"], correct: 1 }, { question: "To apply schema changes to the DB, run:", options: ["prisma push", "prisma migrate dev", "prisma generate", "npm run dev"], correct: 1 }, { question: "A 'relation' in DB connects:", options: ["Two tables", "Two users", "Two servers", "Two files"], correct: 0 }] } }] } },
          { title: "Unit 4: Server Actions", description: "Mutations.", order: 4, lessons: { create: [{ title: "Forms", theory: JSON.stringify([createHeading("No API Routes Needed", 2), createParagraph("Server Actions allow you to call async server functions directly from the 'action' prop of a form.")]), questions: { create: [{ question: "Server Actions run on:", options: ["The Client", "The Server", "The Edge", "The Browser"], correct: 1 }, { question: "They are great for:", options: ["Form submissions", "Animations", "CSS", "State management"], correct: 0 }, { question: "Server Actions must be async:", options: ["True", "False"], correct: 0 }] } }] } },
          { title: "Unit 5: Deployment", description: "Vercel.", order: 5, lessons: { create: [{ title: "CI/CD", theory: JSON.stringify([createHeading("Git Integration", 2), createParagraph("Connect your GitHub repo to Vercel. Every push to 'main' automatically builds and deploys your site.")]), questions: { create: [{ question: "Vercel is optimized for:", options: ["PHP", "Next.js", "Java", "Python"], correct: 1 }, { question: "Environment variables in production are set in:", options: ["The code", "Vercel Project Settings", ".env file locally", "The browser"], correct: 1 }, { question: "CI/CD stands for:", options: ["Continuous Integration / Continuous Deployment", "Code Is Cool Dude", "Create In Case Done", "Computer Internet CD"], correct: 0 }] } }] } }
        ]
      }
    }
  });

  // -----------------------------------------------------------------------
  // 4. SEED EVENTS
  // -----------------------------------------------------------------------
  console.log("📅 Seeding Events...");
  const events = [
    {
      title: "BookVerse: 'Atomic Habits'",
      description: "Discussion on building good habits.",
      date: new Date("2026-03-15T19:00:00Z"),
      location: "Discord Stage",
      type: "Book Club",
      status: "UPCOMING",
      meetingLink: "https://discord.gg/castpotro-bookverse",
    },
    {
      title: "Castpotro Podcast: AI & Ethics",
      description: "Live Q&A with Dr. Ayesha.",
      date: new Date("2026-03-20T20:00:00Z"),
      location: "YouTube Live",
      type: "Podcast",
      status: "UPCOMING",
      meetingLink: "https://youtube.com/castpotro/live",
    },
    {
      title: "ChatterBox: Elevator Pitch",
      description: "Speed networking practice.",
      date: new Date("2026-03-25T18:00:00Z"),
      location: "Zoom",
      type: "Networking",
      status: "UPCOMING",
      meetingLink: "https://zoom.us/j/chatterbox",
    },
    {
      title: "Workshop: CV Review",
      description: "Live CV reviews by HR professionals.",
      date: new Date("2026-04-01T10:00:00Z"),
      location: "Google Meet",
      type: "Workshop",
      status: "UPCOMING",
      meetingLink: "https://meet.google.com/cv-review",
    },
  ];

  for (const e of events) {
    await prisma.event.create({ data: e });
  }

  // -----------------------------------------------------------------------
  // 5. SEED QUESTS
  // -----------------------------------------------------------------------
  console.log("⚔️ Seeding Quests...");
  const quests = [
    {
      title: "The Reflective Journal",
      description: "Write 100 words about a conflict you handled poorly and how you'd fix it.",
      xp: 150,
      sdgId: 4,
      frequency: "WEEKLY",
      verificationType: "TEXT",
      aiPrompt: "Analyze text for conflict resolution strategy. Minimum 50 words.",
    },
    {
      title: "Green Thumb",
      description: "Plant a tree and upload a photo.",
      xp: 500,
      sdgId: 13,
      frequency: "ONCE",
      verificationType: "AI_IMAGE",
      aiPrompt: "Identify plant, tree, or gardening activity in image.",
    },
    {
      title: "Local Mentor",
      description: "Teach a digital skill to someone else.",
      xp: 300,
      sdgId: 10,
      frequency: "MONTHLY",
      verificationType: "TEXT",
      aiPrompt: "Verify teaching experience details.",
    },
  ];

  for (const q of quests) {
    await prisma.quest.create({ data: q });
  }

  // -----------------------------------------------------------------------
  // 6. SEED JOBS (LOCKED)
  // -----------------------------------------------------------------------
  console.log("💼 Seeding Jobs...");
  const jobs = [
    {
      role: "Junior React Developer",
      company: "TechSolutions BD",
      location: "Dhaka",
      type: "Full-Time",
      salary: "45,000 BDT",
      isPromoted: true,
      isOpen: true,
      requiredCourse: webCourse.id,
    },
    {
      role: "Prompt Engineer Intern",
      company: "Brain Station 23",
      location: "Remote",
      type: "Internship",
      salary: "15,000 BDT",
      isPromoted: false,
      isOpen: true,
      requiredCourse: promptCourse.id,
    },
    {
      role: "Product Manager (Associate)",
      company: "Pathao",
      location: "Gulshan",
      type: "Full-Time",
      salary: "80,000 BDT",
      isPromoted: true,
      isOpen: true,
      requiredCourse: leadershipCourse.id,
    },
    {
      role: "Customer Success Specialist",
      company: "Foodpanda",
      location: "Dhaka",
      type: "Contract",
      salary: "35,000 BDT",
      isPromoted: false,
      isOpen: true,
      requiredCourse: commCourse.id,
    },
    {
      role: "Business Analyst",
      company: "Grameenphone",
      location: "Bashundhara",
      type: "Full-Time",
      salary: "65,000 BDT",
      isPromoted: false,
      isOpen: true,
      requiredCourse: criticalCourse.id,
    }
  ];

  for (const j of jobs) {
    await prisma.job.create({ data: j });
  }

  console.log("🚀 Block-Based Seed Completed Successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
