# Atlas AI


Atlas AI is an intelligent platform bridging students and colleges by offering personalized AI-driven doubt-solving and mentoring. It adapts to each student’s unique learning needs, tracks performance over time, and dynamically generates quizzes to reinforce weak topics.

## 🚀 Features

* **Personalized AI Mentor**
  Remembers individual student flaws and weaknesses to tailor explanations and guidance.

* **Custom Quiz Generator**
  Students input a topic, and Atlas AI generates a 10-question quiz.

* **Performance Tracking Dashboard**
  Visualize your progress, see motivational quotes, and get insights into your strengths and weaknesses.

* **Adaptive Learning Path**
  Uses historical quiz results and doubt history to focus on topics where the student needs the most help.

## 🛠️ Tech Stack

* **Next.js & React**
* **Tailwind CSS & ShadCN/UI**
* **Prisma ORM & PostgreSQL**
* **Gemini API (Google GenAI)**

## 📦 Installation & Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/Himalay-NRHS/Atlas-AI.git
   cd Atlas-AI
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env.local` file in the project root and add:

   ```env
   NEXT_PUBLIC_GENAI_API_KEY=your_gemini_api_key
   DATABASE_URL=postgresql://user:password@host:port/dbname
   ```

4. **Run in development mode**

   ```bash
   npm run dev
   ```

5. **Build for production**

   ```bash
   npm run build
   ```

## 🎯 Usage

1. Open the app in your browser at `http://localhost:3000`.
2. Sign up or log in with your student credentials.
3. Navigate to **Doubts** to ask questions—your AI mentor responds based on your learning history.
4. Go to **Quizzes** to generate topic-based quizzes and test your knowledge.
5. Review your **Dashboard** to track progress and see recommended focus areas.

---

<div align="center">
  Made with ❤️ by Team Bit‑Flippers
</div>
