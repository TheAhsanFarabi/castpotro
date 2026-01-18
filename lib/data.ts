import { Mic, Target, Heart, Clock, Briefcase, Users, Brain, Lightbulb, Puzzle, Compass, Check, MessageCircle, Lock, Zap } from 'lucide-react';

export const SKILLS = [
  { 
    id: 'public-speaking', 
    name: 'Public Speaking', 
    icon: Mic, 
    learners: '120k',
    description: 'Master the art of confident communication.',
    units: [
      {
        title: "Unit 1",
        description: "Voice & Tone Control",
        levels: [
           { id: 'ps-1-1', status: 'completed', icon: Check },
           { id: 'ps-1-2', status: 'active', icon: MessageCircle },
           { id: 'ps-1-3', status: 'locked', icon: Mic },
           { id: 'ps-1-4', status: 'locked', icon: Lock },
        ]
      },
      {
        title: "Unit 2",
        description: "Body Language Mastery",
        levels: [
           { id: 'ps-2-1', status: 'locked', icon: Lock },
           { id: 'ps-2-2', status: 'locked', icon: Lock },
        ]
      }
    ],
    questions: [
      {
        question: "Which image best represents 'confident posture'?",
        type: "image-select",
        options: [
          { id: 1, label: "Slouching", emoji: "🙇" },
          { id: 2, label: "Upright", emoji: "🧍" },
          { id: 3, label: "Hiding", emoji: "🫣" },
          { id: 4, label: "Sleeping", emoji: "😴" },
        ],
        correctId: 2
      },
      {
        question: "What is the best way to start a speech?",
        type: "text-select",
        options: [
          { id: 1, label: "Apologize for being nervous." },
          { id: 2, label: "Start reading from your notes immediately." },
          { id: 3, label: "Use a hook or story to grab attention." },
        ],
        correctId: 3
      }
    ]
  },
  { 
    id: 'leadership', 
    name: 'Leadership', 
    icon: Target, 
    learners: '85k',
    description: 'Inspire and guide teams effectively.',
    units: [
      {
        title: "Unit 1",
        description: "Core Leadership Styles",
        levels: [
           { id: 'ld-1-1', status: 'completed', icon: Check },
           { id: 'ld-1-2', status: 'active', icon: Users },
           { id: 'ld-1-3', status: 'locked', icon: Target },
        ]
      }
    ],
    questions: [
      {
        question: "A team member is underperforming. You should:",
        type: "text-select",
        options: [
          { id: 1, label: "Yell at them in public." },
          { id: 2, label: "Ignore it and hope they improve." },
          { id: 3, label: "Have a private 1-on-1 to understand why." },
        ],
        correctId: 3
      },
      {
        question: "Which leader trait is most important?",
        type: "image-select",
        options: [
          { id: 1, label: "Empathy", emoji: "❤️" },
          { id: 2, label: "Greed", emoji: "💰" },
          { id: 3, label: "Ego", emoji: "👑" },
          { id: 4, label: "Fear", emoji: "👹" },
        ],
        correctId: 1
      }
    ]
  },
  // ... (Repeating pattern for other skills with default data for brevity)
  { id: 'emotional-iq', name: 'Emotional IQ', icon: Heart, learners: '200k', units: [], questions: [] },
  { id: 'time-mgmt', name: 'Time Mgmt', icon: Clock, learners: '300k', units: [], questions: [] },
  { id: 'negotiation', name: 'Negotiation', icon: Briefcase, learners: '45k', units: [], questions: [] },
  { id: 'teamwork', name: 'Teamwork', icon: Users, learners: '150k', units: [], questions: [] },
  { id: 'critical-thinking', name: 'Critical Thinking', icon: Brain, learners: '90k', units: [], questions: [] },
  { id: 'creativity', name: 'Creativity', icon: Lightbulb, learners: '60k', units: [], questions: [] },
  { id: 'problem-solving', name: 'Problem Solving', icon: Puzzle, learners: '75k', units: [], questions: [] },
  { id: 'strategic-thinking', name: 'Strategic Thinking', icon: Compass, learners: '50k', units: [], questions: [] },
];

// Fill defaults for empty skills to prevent errors
SKILLS.forEach(skill => {
  if (skill.questions.length === 0) {
    skill.questions = [
        {
        question: `Why do you want to learn ${skill.name}?`,
        type: "text-select",
        options: [
          { id: 1, label: "Personal Growth" },
          { id: 2, label: "Career Advancement" },
          { id: 3, label: "Just for fun" },
        ],
        correctId: 1 // No wrong answer really
      }
    ];
  }
  if (skill.units.length === 0) {
      skill.units = [
          {
            title: "Unit 1",
            description: "Foundations",
            levels: [
               { id: 'def-1', status: 'active', icon: Zap },
               { id: 'def-2', status: 'locked', icon: Lock },
               { id: 'def-3', status: 'locked', icon: Lock },
            ]
          }
      ]
  }
});