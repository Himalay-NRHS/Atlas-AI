"use client"

import { useState } from "react"
import { useRouter as useNav } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, MessageSquare, Mic, Sun, Moon } from "lucide-react"
import router from "next/router"


const handleRedirect = (url: string) => {
    // Use window.location.href for external URLs like localhost:8501
    if (url.startsWith("http")) {
      window.location.href = url
    } else {
      router.push(url)
    }
  }


export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }
  
  const router = useNav()

  const handleClick = () => {
    router.push("/studytools/Voicechat")
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-12">
          <h1
            className={`text-3xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            AI Summarizer Tools
          </h1>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className={`rounded-full ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* PDF Summarizer Card */}
          <Card
            onClick={() => handleRedirect("http://172.20.3.10:8502")}
            className={`overflow-hidden ${
              isDarkMode
                ? "bg-gradient-to-br from-gray-800 to-gray-900 text-white border-gray-700"
                : "bg-gradient-to-br from-white to-gray-50 border-gray-200"
            } hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/5 pointer-events-none" />
            <CardHeader className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-xl">PDF Summarizer</CardTitle>
              <CardDescription className={isDarkMode ? "text-gray-300" : "text-gray-500"}>
                Extract key insights from your PDF documents
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                Upload your PDF files and get concise summaries highlighting the most important
                information.
              </p>
            </CardContent>
            <CardFooter className="relative z-10">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Summarize PDF
              </Button>
            </CardFooter>
          </Card>

          {/* Text Summarizer Card */}
          <Card
            onClick={() => handleRedirect("http://172.20.3.10:8501")}
            className={`overflow-hidden ${
              isDarkMode
                ? "bg-gradient-to-br from-gray-800 to-gray-900 text-white border-gray-700"
                : "bg-gradient-to-br from-white to-gray-50 border-gray-200"
            } hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 pointer-events-none" />
            <CardHeader className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Text Summarizer</CardTitle>
              <CardDescription className={isDarkMode ? "text-gray-300" : "text-gray-500"}>
                Condense long articles and text content
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                Paste your long-form content and receive a concise summary that captures the
                essential points.
              </p>
            </CardContent>
            <CardFooter className="relative z-10">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Summarize Text
              </Button>
            </CardFooter>
          </Card>

          {/* Voice Assistant Card */}
          <Card
          onClick={() => router.push("/studytools/Voicechat")}
            className={`overflow-hidden ${
              isDarkMode
                ? "bg-gradient-to-br from-gray-800 to-gray-900 text-white border-gray-700"
                : "bg-gradient-to-br from-white to-gray-50 border-gray-200"
            } hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 pointer-events-none" />
            <CardHeader className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <Mic className="h-6 w-6 text-emerald-600" />
              </div>
              <CardTitle className="text-xl">Voice Assistant</CardTitle>
              <CardDescription className={isDarkMode ? "text-gray-300" : "text-gray-500"}>
                Interact with your content using voice commands
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                Speak to your assistant and get audio responses. Perfect for hands-free summarization
                and information retrieval.
              </p>
            </CardContent>
            <CardFooter className="relative z-10">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={handleClick}
              >
                Start Voice Assistant
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
