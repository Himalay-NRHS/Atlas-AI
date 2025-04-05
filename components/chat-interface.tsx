"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import MessageItem from "@/components/message-item"
import { useChat } from "@/lib/hooks/use-chat"

export default function ChatInterface() {
  const { messages, input, setInput, sendMessage, isLoading } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      sendMessage()
    }
  }

  return (
    <Card className="w-full h-[80vh] flex flex-col overflow-hidden border-zinc-200 dark:border-zinc-700 shadow-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="max-w-md text-center p-6 rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <h3 className="text-xl font-semibold mb-2 text-zinc-800 dark:text-zinc-100">Welcome to Atlas AI</h3>
              <p className="text-zinc-600 dark:text-zinc-300">
                This is your AI mentor. You can ask any questions without hesitation, and I'll do my best to provide
                helpful, educational guidance.
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => <MessageItem key={message.id} message={message} />)
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-zinc-200 dark:border-zinc-700">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your question..."
            className="flex-1 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </Card>
  )
}

