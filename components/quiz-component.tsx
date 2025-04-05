"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"
import { CheckCircle, XCircle } from "lucide-react"
import { useSession } from "next-auth/react"

// Define types for our quiz data
type QuizData = {
  questions: string[]
  options: {
    choices: string[][]
  }
  answers: number[]
}

export default function QuizComponent() {
  // Hardcoded endpoints
  const quizApiEndpoint = "/api/quiz"
  const resultApiEndpoint = "/api/result"

  // Get user's email from session
  const { data: session } = useSession()
  const email = session?.user?.email || ""
  console.log("User email:", email)

  // View states: "topic", "quiz", "result"
  const [view, setView] = useState<"topic" | "quiz" | "result">("topic")

  // Topic selection state
  const [topic, setTopic] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Quiz state
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  // Track the text of incorrect questions
  const [incorrectQuestions, setIncorrectQuestions] = useState<string[]>([])
  const [direction, setDirection] = useState(1) // 1 for forward, -1 for backward

  // Result state
  const [suggestion, setSuggestion] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch quiz data from backend
  const fetchQuizData = async (topicValue: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(quizApiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic: topicValue }),
      })

      const data = await response.json()

      if (data.error) {
        console.error("Backend error:", data.error)
        setIsLoading(false)
        return
      }

      // Data is expected to be in the required structure:
      // { questions: string[], options: { choices: string[][] }, answers: number[] }
      setQuizData(data)
      setView("quiz")
    } catch (error) {
      console.error("Error fetching quiz data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Submit quiz results to backend
  const submitQuizResults = async () => {
    if (!quizData) return

    setIsSubmitting(true)
    try {
      const response = await fetch(resultApiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          incorrectQuestions,
         
          email,
         // Send the number of incorrect questions
        }),
      })

      if (!response.ok) {
        throw new Error(`Network response not ok: ${response.statusText}`)
      }

      const contentType = response.headers.get("content-type")
      let data
      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        console.error("Expected JSON response but got:", contentType)
        data = { suggestion: "Quiz completed successfully!" }
      }
      setSuggestion(data.suggestion || "Quiz completed successfully!")
      setView("result")
    } catch (error) {
      console.error("Error submitting quiz results:", error)
      setSuggestion("An error occurred while submitting your quiz results.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle topic form submission
  const handleTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (topic.trim()) {
      fetchQuizData(topic)
    }
  }

  // Handle option selection and record incorrect questions
  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex)
  }

  // Handle next question
  const handleNextQuestion = () => {
    if (!quizData) return

    // If the selected option is not the correct answer, record the question text
    if (selectedOption !== quizData.answers[currentQuestion]) {
      setIncorrectQuestions((prev) => [
        ...prev,
        quizData.questions[currentQuestion],
      ])
    }

    setDirection(1)
    setSelectedOption(null)

    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Quiz completed, submit results
      submitQuizResults()
    }
  }

  // Handle restart quiz
  const handleRestartQuiz = () => {
    setTopic("")
    setQuizData(null)
    setCurrentQuestion(0)
    setSelectedOption(null)
    setIncorrectQuestions([])
    setSuggestion("")
    setView("topic")
  }

  // Calculate progress percentage
  const progress = quizData ? ((currentQuestion + 1) / quizData.questions.length) * 100 : 0

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
              <h2 className="text-2xl font-bold tracking-tight text-black">
                Quiz on {topic}
              </h2>
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
                  <h3 className="text-xl font-medium mb-6 text-black">
                    {quizData.questions[currentQuestion]}
                  </h3>

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
                  {/* Display suggestion from backend */}
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold">Suggestions for Improvement</h3>
                    <p className="text-gray-600 mt-2">{suggestion}</p>
                  </div>

                  {/* Score Breakdown (optional placeholder) */}
                  <div className="flex justify-between w-full">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-black mr-2" />
                      <span>Correct: {quizData?.questions.length! - incorrectQuestions.length || 0}</span>
                    </div>
                    <div className="flex items-center">
                      <XCircle className="h-5 w-5 text-gray-500 mr-2" />
                      <span>Incorrect: {incorrectQuestions.length}</span>
                    </div>
                  </div>
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
