"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import {
  Brain, FileQuestion, LogOut, Video, BookOpen, ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

const motivationalQuotes = [
  "The only way to learn mathematics is to do mathematics. — Paul Halmos",
  "Education is the passport to the future... — Malcolm X",
  "The beautiful thing about learning is that no one can take it away from you. — B.B. King",
]

interface DashboardData {
  user: {
    name: string
  }
  performanceData: {
    quizNumber: number
    marks: number
  }[]
  weakTopics: string[]
  onlineDates: any[]
}

export default function Dashboard() {
  const [randomQuote, setRandomQuote] = useState("")
  const { data: session, status } = useSession()
  const router = useRouter()

  const [dashboardData, setDashboardData] = useState<DashboardData>({
    user: { name: "" },
    performanceData: [],
    weakTopics: [],
    onlineDates: [],
  })

  const [loading, setLoading] = useState(true)

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/dashboard", {
        method: "POST",
        body: JSON.stringify({ email: session?.user?.email }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) throw new Error("Failed to fetch")

      const data = await res.json()

      // Build performanceData from result if needed
      let performanceArray = []
      if (Array.isArray(data.performanceData) && data.performanceData.length > 0) {
        performanceArray = data.performanceData
      } else if (data.result && typeof data.result === "object") {
        performanceArray = Object.entries(data.result).map(([quizNumber, marks]) => ({
          quizNumber: Number(quizNumber),
          marks: Number(marks),
        }))
      }

      setDashboardData({
        user: {
          name: data.user?.name || "User",
        },
        performanceData: performanceArray,
        weakTopics: Array.isArray(data.weakTopics) ? data.weakTopics : [],
        onlineDates: data.onlineDates || [],
      })

    } catch (error) {
      console.error("Error loading dashboard:", error)
      setDashboardData({
        user: { name: "User" },
        performanceData: [],
        weakTopics: [],
        onlineDates: [],
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      fetchDashboardData()
    } else if (status === "unauthenticated") {
      setLoading(false)
    }
  }, [status])

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length)
    setRandomQuote(motivationalQuotes[randomIndex])
  }, [])

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/login" })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              Atlas AI
            </span>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="flex items-center gap-2">
                <Video className="h-4 w-4" /> AI Mock Interview
              </Button>
              <Button variant="ghost" className="flex items-center gap-2"
                onClick={() => { router.push("/studytools") }}>
                <BookOpen className="h-4 w-4" /> Study Tools
              </Button>
              <Button variant="destructive" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Graph and Weak Topics */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <motion.div className="lg:col-span-3 bg-white rounded-xl shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Performance Tracker</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dashboardData.performanceData}>
                    <defs>
                      <linearGradient id="colorMarks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#4ade80" stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="quizNumber" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => [`${value} marks`, "Score"]} labelFormatter={(label) => `Quiz ${label}`} />
                    <Area type="monotone" dataKey="marks" stroke="#4ade80" fillOpacity={1} fill="url(#colorMarks)" activeDot={{ r: 8 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          <motion.div className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Areas to Improve</CardTitle>
                <CardDescription>Focus on these topics to boost your performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {dashboardData.weakTopics.map((topic, index) => (
                    <motion.li key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.1 * index }} className="flex items-start">
                      <Badge variant="destructive" className="mr-2 mt-1">{index + 1}</Badge>
                      <span className="text-gray-700">{topic}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Motivational Quote */}
        <motion.div className="bg-primary/10 rounded-xl p-6 mb-8 border border-primary/20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-start">
            <div className="mr-4 mt-1">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-primary text-xl">"</span>
              </div>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-800 italic">{randomQuote}</p>
            </div>
          </div>
        </motion.div>

        {/* AI Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center"><Brain className="h-6 w-6 mr-2 text-primary" /> AI Personal Tutor</CardTitle>
                <CardDescription>Get personalized help with any subject or topic</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col h-full">
                <p className="text-gray-600 mb-4">
                  Your AI tutor adapts to your learning style and provides explanations tailored to your needs.
                </p>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {["Math", "Science", "History", "Literature", "Languages", "Coding"].map(subject => (
                    <Badge key={subject} variant="outline" className="justify-center">{subject}</Badge>
                  ))}
                </div>
                <Button className="w-full mt-4" size="lg" onClick={() => router.push("/mentor")}>
                  Chat with AI Tutor <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center"><FileQuestion className="h-6 w-6 mr-2 text-primary" /> AI Quiz Generator</CardTitle>
                <CardDescription>Test your knowledge with personalized quizzes</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col h-full">
                <p className="text-gray-600 mb-4">
                  Enter any topic and get custom quizzes with feedback and improvement tips.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Recent Quiz Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Algebra", "Cell Biology", "Ancient Rome"].map(topic => (
                      <Badge key={topic} className="bg-blue-100 text-blue-800 hover:bg-blue-200">{topic}</Badge>
                    ))}
                  </div>
                </div>
                <Button className="w-full mt-4" size="lg" onClick={() => router.push("/quiz")}>
                  Generate a Quiz <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
