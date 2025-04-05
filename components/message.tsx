"use client"

import type { Message as MessageType } from "@/lib/hooks/use-chat"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface MessageProps {
  message: MessageType
  index: number
  isLatest: boolean
}

export default function Message({ message, index, isLatest }: MessageProps) {
  const isUser = message.role === "user"
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  // Typing animation for AI responses
  useEffect(() => {
    if (!isUser && isLatest) {
      setIsTyping(true)
      let i = 0
      const text = message.content
      const typingInterval = setInterval(() => {
        if (i < text.length) {
          setDisplayedText(text.substring(0, i + 1))
          i++
        } else {
          clearInterval(typingInterval)
          setIsTyping(false)
        }
      }, 20) // Adjust speed as needed

      return () => clearInterval(typingInterval)
    } else if (!isUser) {
      setDisplayedText(message.content)
    }
  }, [message.content, isUser, isLatest])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn("flex items-start gap-3", isUser && "justify-end")}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
          <span className="text-zinc-400 text-xs">AI</span>
        </div>
      )}

      <motion.div
        className={cn("p-4 rounded-lg max-w-[80%]", isUser ? "bg-emerald-600 text-white" : "bg-zinc-800 text-zinc-100")}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {isUser ? message.content : displayedText}
        {isTyping && <span className="ml-1 animate-pulse">|</span>}
      </motion.div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
          <span className="text-white text-xs">You</span>
        </div>
      )}
    </motion.div>
  )
}

