"use client"

import React from "react"
import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import ReactMarkdown from "react-markdown"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { data: session } = useSession()

  // Load messages from localStorage on initial render
  useEffect(() => {
    const savedMessages = localStorage.getItem("atlas-ai-messages")
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages))
      } catch (error) {
        console.error("Failed to parse saved messages:", error)
      }
    }
  }, [])

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("atlas-ai-messages", JSON.stringify(messages))
  }, [messages])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    // Add user message to the chat
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Send the message to your backend
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          context: "This is an educational AI mentor conversation",
          email: session?.user?.email || '',
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response from AI")
      }

      const data = await response.json()

      // Extract the text from the API response
      let responseText = "Sorry, I couldn't process your request."
      if (
        data.response &&
        data.response.candidates &&
        data.response.candidates.length > 0 &&
        data.response.candidates[0].content &&
        data.response.candidates[0].content.parts &&
        data.response.candidates[0].content.parts.length > 0
      ) {
        responseText = data.response.candidates[0].content.parts[0].text
      }

      // Add AI response to the chat
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: responseText,
        },
      ])
    } catch (error) {
      console.error("Error sending message:", error)

      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "I'm having trouble connecting right now. Please try again later.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      sendMessage()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="p-4 border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Atlas AI</h1>
          <p className="text-sm text-gray-500">Your Personal Mentor</p>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
        <div className="max-w-5xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="p-6 rounded-lg bg-white shadow-md border border-gray-100">
              <h2 className="text-xl font-semibold mb-3 text-gray-900">Welcome to Atlas AI</h2>
              <p className="text-gray-600 leading-relaxed">
                This is your AI mentor. You can ask any questions without hesitation, and I'll do my best to provide
                helpful, educational guidance. What would you like to learn today?
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-start gap-3 animate-[fadeIn_0.3s_ease-in-out]",
                message.role === "user" && "justify-end"
              )}
              style={{
                animation: "fadeIn 0.3s ease-in-out",
              }}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="text-emerald-600 text-xs">AI</span>
                </div>
              )}

              <div
                className={cn(
                  "p-4 rounded-lg max-w-[80%] shadow-sm",
                  message.role === "user"
                    ? "bg-emerald-500 text-white"
                    : "bg-white text-gray-800 border border-gray-200"
                )}
              >
                {/* Use ReactMarkdown to render the formatted content */}
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>

              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                  <span className="text-white text-xs">You</span>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-emerald-600 text-xs">AI</span>
              </div>
              <div className="p-4 rounded-lg bg-white text-gray-800 max-w-[80%] border border-gray-200 shadow-sm">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask your question..."
              className="w-full bg-white border border-gray-300 rounded-full py-3 pl-4 pr-12 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-emerald-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-emerald-600 active:scale-95"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
