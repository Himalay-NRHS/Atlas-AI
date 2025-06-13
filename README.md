# Atlas AI

Atlas AI is an intelligent platform bridging students and colleges by offering personalized AI-driven doubt-solving and mentoring. Built as a Gemini API wrapper, Atlas AI adapts to each student’s unique learning needs, tracks performance over time, and dynamically generates quizzes to reinforce weak topics.

## 🚀 Features

* **Personalized AI Mentor**
  Remembers individual student flaws and weaknesses to tailor explanations and guidance.

* **Custom Quiz Generator**
  Students input a topic, and Atlas AI generates a 10-question quiz with high accuracy.

* **Performance Tracking Dashboard**
  Visualize your progress, see motivational quotes, and get insights into your strengths and weaknesses.

* **Adaptive Learning Path**
  The AI mentor uses historical quiz results and doubt history to focus on topics where the student needs the most help.

## 🛠️ Tech Stack

* **Frontend:** Next.js, React, Tailwind CSS, ShadCN/UI
* **Backend & API:** Gemini API (Google GenAI)
* **Database:** PostgreSQL via Prisma ORM
* **Hosting & Deployment:** Vercel (frontend), AWS (backend)
* **Version Control:** Git & GitHub

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/atlas-ai.git
   cd atlas-ai
   ```

2. **Install dependencies**

   ```bash
   # Frontend
   cd client
   npm install

   # Backend (if separate)
   cd ../server
   npm install
   ```

3. **Configure environment variables**
   Create a `.env.local` file in the root (or respective folders) and add:

   ```env
   NEXT_PUBLIC_GENAI_API_KEY=your_gemini_api_key
   DATABASE_URL=postgresql://user:password@host:port/dbname
   ```

4. **Run in development mode**

   ```bash
   # Frontend
   cd client && npm run dev

   # Backend
   cd server && npm run dev
   ```

5. **Build & deploy**

   ```bash
   # Frontend
   cd client && npm run build && npm start
   ```

## 🎯 Usage

1. Open the app in your browser at `http://localhost:3000`.
2. Sign up or log in with your student credentials.
3. Navigate to **Doubts** to ask questions—your AI mentor responds based on your learning history.
4. Go to **Quizzes** to generate topic-based quizzes and test your knowledge.
5. Review your **Dashboard** to track progress and see recommended focus areas.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork this repository.
2. Create a new branch: `git checkout -b feature/YourFeatureName`.
3. Commit your changes: `git commit -m "feat: add YourFeatureName"`.
4. Push to the branch: `git push origin feature/YourFeatureName`.
5. Open a Pull Request.

## 📝 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  Made with ❤️ by the Atlas AI Team
</div>
