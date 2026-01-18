# Castpotro V2.0

**Castpotro** is a personalized, gamified learning platform dedicated to mastering soft skills. Designed as a "Duolingo for soft skills," it helps users improve communication, leadership, critical thinking, ethics, and teamwork through interactive lessons, daily challenges, and AI-driven mentorship.

## Features

### Core Learning

* **Gamified Learning Paths:** Interactive skill trees for modules like Public Speaking, Leadership, and Emotional Intelligence.
* **Progress Tracking:** Experience points (XP) system, streak counters, and level progression.
* **Milestone-based:** Focuses on skill validation and practical application rather than just time spent learning.

### AI-Powered Mentorship

* **Gemini Integration:** Built-in AI mentor powered by Google's Gemini models.
* **Context-Aware:** The AI understands the specific context of Castpotro to answer questions about courses, soft skills, and career advice.

### Gamification & Social

* **Leaderboards:** Weekly ranking systems (Gold League, Silver League, etc.) to foster friendly competition.
* **Daily Quests:** Dynamic daily challenges to maintain high engagement.
* **Badges & Achievements:** Earn badges for various accomplishments, such as consistency or teamwork.
* **Profile Customization:** Custom avatar creator allowing users to modify shapes, colors, and icons.

### Career & Events

* **Job Board:** Connects learners with employment opportunities based on their verified skill profile.
* **Events:** Registration system for workshops, hackathons, and community meetups.

## Tech Stack

* **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Database:** [MySQL](https://www.mysql.com/)
* **ORM:** [Prisma](https://www.prisma.io/)
* **Authentication:** Custom implementation with `bcryptjs` & JWT (via Cookies)
* **AI:** [Google Generative AI SDK](https://www.npmjs.com/package/@google/generative-ai)

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

* Node.js (v18 or higher)
* npm or yarn
* MySQL Database (running locally or a cloud instance)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/castpotro.git
cd castpotro

```

### 2. Install Dependencies

```bash
npm install

```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add the following keys:

```env
# Database Connection String
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"

# Google Gemini API Key
GEMINI_API_KEY="your_google_ai_studio_key"

```

### 4. Database Setup

Push the Prisma schema to your database:

```bash
# Generate the Prisma Client
npx prisma generate

# Run migrations to create tables
npx prisma migrate dev --name init

```

### 5. Run the Development Server

```bash
npm run dev

```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result.

## Project Structure

```text
gemini/
├── app/
│   ├── actions.ts       # Server Actions (Auth, AI Chat, etc.)
│   ├── components/      # Reusable UI components
│   ├── dashboard/       # Protected dashboard routes (Learn, Profile, Quests)
│   ├── login/           # Login page
│   ├── register/        # Registration page
│   └── page.ts          # Landing page
├── lib/
│   ├── data.ts          # Static data (Mock courses, badges, etc.)
│   └── prisma.ts        # Prisma client singleton
├── prisma/
│   └── schema.prisma    # Database schema definition
└── public/              # Static assets (images, icons)

```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## License

This project is open-source and available under the [MIT License](https://www.google.com/search?q=LICENSE).
