"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"
import { CheckCircle, XCircle } from "lucide-react"

// Define types for our quiz data
type QuizData = {
  questions: string[]
  options: {
    choices: string[][]
  }
  answers: number[]
}

// Define props for the component
interface QuizComponentProps {
  quizApiEndpoint?: string // API endpoint to fetch quiz data
  resultApiEndpoint?: string // API endpoint to submit results
  onComplete?: (results: any) => void // Optional callback when quiz completes
}

export default function QuizComponent({
  quizApiEndpoint = "/api/quiz",
  resultApiEndpoint = "/api/result",
  onComplete,
}: QuizComponentProps) {
  // View states: "topic", "quiz", "result"
  const [view, setView] = useState<"topic" | "quiz" | "result">("topic")

  // Topic selection state
  const [topic, setTopic] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Quiz state
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [incorrectAnswers, setIncorrectAnswers] = useState<number[]>([])
  const [direction, setDirection] = useState(1) // 1 for forward, -1 for backward

  // Result state
  const [resultMessage, setResultMessage] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch quiz data from backend
  const fetchQuizData = async (topicValue: string) => {
    setIsLoading(true)
    try {
      // In a real implementation, fetch from your API
      // const response = await fetch(`${quizApiEndpoint}?topic=${encodeURIComponent(topicValue)}`);
      // const data = await response.json();
      // setQuizData(data);

      // For now, use dummy data
      setTimeout(() => {
        setQuizData({
          questions: [
            "What is the capital of France?",
            "Which planet is known as the Red Planet?",
            "What is the largest mammal?",
            "Who wrote 'Hamlet'?",
            "What is the boiling point of water at sea level in Celsius?",
            "Which element has the chemical symbol 'O'?",
            "In which year did World War II end?",
            "What is the square root of 64?",
            "Which ocean is the largest?",
            "What is the fastest land animal?",
          ],
          options: {
            choices: [
              ["Paris", "Rome", "Madrid", "Berlin"],
              ["Earth", "Mars", "Jupiter", "Venus"],
              ["Elephant", "Blue Whale", "Giraffe", "Orca"],
              ["Shakespeare", "Dickens", "Austen", "Twain"],
              ["90", "100", "110", "120"],
              ["Oxygen", "Gold", "Osmium", "Ozone"],
              ["1945", "1939", "1918", "1963"],
              ["6", "7", "8", "9"],
              ["Atlantic", "Pacific", "Indian", "Arctic"],
              ["Cheetah", "Lion", "Tiger", "Leopard"],
            ],
          },
          answers: [0, 1, 1, 0, 1, 0, 0, 2, 1, 0],
        })
        setIsLoading(false)
        setView("quiz")
      }, 800)
    } catch (error) {
      console.error("Error fetching quiz data:", error)
      setIsLoading(false)
    }
  }

  // Submit quiz results to backend
  const submitQuizResults = async () => {
    if (!quizData) return

    setIsSubmitting(true)
    try {
      // In a real implementation, submit to your API
      // const response = await fetch(resultApiEndpoint, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     topic,
      //     incorrectAnswers,
      //     totalQuestions: quizData.questions.length,
      //   }),
      // });
      // const data = await response.json();
      // setResultMessage(data.message);

      // For now, use dummy response
      setTimeout(() => {
        const correctCount = quizData.questions.length - incorrectAnswers.length
        const score = Math.round((correctCount / quizData.questions.length) * 100)

        // This would normally come from your backend
        setResultMessage("Great job on completing the quiz! Your performance shows a good understanding of the topic.")

        setIsSubmitting(false)
        setView("result")

        // Call onComplete callback if provided
        if (onComplete) {
          onComplete({
            topic,
            score,
            correctCount,
            incorrectAnswers,
            totalQuestions: quizData.questions.length,
          })
        }
      }, 1000)
    } catch (error) {
      console.error("Error submitting quiz results:", error)
      setIsSubmitting(false)
    }
  }

  // Handle topic form submission
  const handleTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchQuizData(topic)
  }

  // Handle option selection
  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex)
  }

  // Handle next question
  const handleNextQuestion = () => {
    if (!quizData) return

    // Check if answer is incorrect
    if (selectedOption !== quizData.answers[currentQuestion]) {
      setIncorrectAnswers([...incorrectAnswers, currentQuestion])
    }

    setDirection(1)
    setSelectedOption(null)

    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Quiz completed
      submitQuizResults()
    }
  }

  // Handle restart quiz
  const handleRestartQuiz = () => {
    setTopic("")
    setQuizData(null)
    setCurrentQuestion(0)
    setSelectedOption(null)
    setIncorrectAnswers([])
    setResultMessage("")
    setView("topic")
  }

  // Calculate progress percentage
  const progress = quizData ? ((currentQuestion + 1) / quizData.questions.length) * 100 : 0

  // Calculate score for results
  const calculateScore = () => {
    if (!quizData) return { score: 0, correctCount: 0, totalQuestions: 0 }

    const totalQuestions = quizData.questions.length
    const correctCount = totalQuestions - incorrectAnswers.length
    const score = Math.round((correctCount / totalQuestions) * 100)

    return { score, correctCount, totalQuestions }
  }

  // Get feedback based on score
  const getFeedback = (score: number) => {
    if (score >= 90) return "Excellent! You're a master of this topic!"
    if (score >= 70) return "Great job! You have a solid understanding!"
    if (score >= 50) return "Good effort! Keep learning and you'll improve!"
    return "Keep practicing! You'll get better with time."
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-4 mt-8">
      <AnimatePresence mode="wait">
        {/* Topic Selection View */}
        {view === "topic" && (
          <motion.div
            key="topic"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="w-full space-y-8 mt-6"
          >
            <div className="text-center">
              <motion.h2
                className="text-3xl font-bold tracking-tight text-black"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                AI Quiz
              </motion.h2>
              <motion.p
                className="mt-3 text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Test your knowledge with our AI-powered quizzes
              </motion.p>
            </div>

            <motion.form
              onSubmit={handleTopicSubmit}
              className="mt-8 space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className="space-y-2">
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
                  What topic would you like to be quizzed on?
                </label>
                <Input
                  id="topic"
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter a topic (e.g., History, Science, Movies)"
                  className="border-gray-300 focus:ring-black focus:border-black"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || !topic.trim()}
                className="w-full bg-black hover:bg-gray-800 text-white transition-all"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Generating Quiz...
                  </div>
                ) : (
                  "Start Quiz"
                )}
              </Button>
            </motion.form>
          </motion.div>
        )}

        {/* Quiz Questions View */}
        {view === "quiz" && quizData && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.6 }}
            className="w-full space-y-6 mt-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-black">Quiz on {topic}</h2>
              <p className="mt-2 text-gray-600">
                Question {currentQuestion + 1} of {quizData.questions.length}
              </p>
            </div>

            <Progress value={progress} className="h-2 bg-gray-200" />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: direction * 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -100 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full"
              >
                <Card className="p-6 shadow-lg border-gray-200">
                  <h3 className="text-xl font-medium mb-6 text-black">{quizData.questions[currentQuestion]}</h3>

                  <div className="space-y-3">
                    {quizData.options.choices[currentQuestion].map((option, index) => (
                      <motion.div key={index} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant={selectedOption === index ? "default" : "outline"}
                          className={`w-full justify-start text-left p-4 h-auto ${
                            selectedOption === index ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"
                          }`}
                          onClick={() => handleOptionSelect(index)}
                        >
                          <span className="mr-3 inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 text-black text-sm">
                            {String.fromCharCode(65 + index)}
                          </span>
                          {option}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-end mt-6">
              <Button
                onClick={handleNextQuestion}
                disabled={selectedOption === null || isSubmitting}
                className="bg-black hover:bg-gray-800 text-white px-6"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : currentQuestion === quizData.questions.length - 1 ? (
                  "Finish Quiz"
                ) : (
                  "Next Question"
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Results View */}
        {view === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="w-full space-y-8 mt-6"
          >
            <div className="text-center">
              <motion.h2
                className="text-3xl font-bold tracking-tight text-black"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Quiz Results
              </motion.h2>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <Card className="p-8 shadow-lg border-gray-200">
                <div className="flex flex-col items-center justify-center space-y-6">
                  {/* Score Circle */}
                  {quizData && (
                    <div className="relative w-40 h-40">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold">{calculateScore().score}%</span>
                      </div>
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="black"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${calculateScore().score * 2.83} ${283 - calculateScore().score * 2.83}`}
                          strokeDashoffset="70.75"
                          initial={{ strokeDasharray: "0 283" }}
                          animate={{
                            strokeDasharray: `${calculateScore().score * 2.83} ${283 - calculateScore().score * 2.83}`,
                          }}
                          transition={{ duration: 1.5, delay: 0.5 }}
                        />
                      </svg>
                    </div>
                  )}

                  {/* Feedback */}
                  <div className="space-y-2 text-center">
                    <h3 className="text-2xl font-semibold">{quizData && getFeedback(calculateScore().score)}</h3>
                    <p className="text-gray-600">
                      {quizData &&
                        `You answered ${calculateScore().correctCount} out of ${calculateScore().totalQuestions} questions correctly.`}
                    </p>

                    {/* Backend Message */}
                    {resultMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="mt-4 p-4 bg-gray-50 rounded-md text-gray-800"
                      >
                        {resultMessage}
                      </motion.div>
                    )}
                  </div>

                  {/* Score Breakdown */}
                  {quizData && (
                    <div className="flex justify-between w-full">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-black mr-2" />
                        <span>Correct: {calculateScore().correctCount}</span>
                      </div>
                      <div className="flex items-center">
                        <XCircle className="h-5 w-5 text-gray-500 mr-2" />
                        <span>Incorrect: {incorrectAnswers.length}</span>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Try Again Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex justify-center"
            >
              <Button onClick={handleRestartQuiz} className="bg-black hover:bg-gray-800 text-white px-8 py-2">
                Try Another Quiz
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

