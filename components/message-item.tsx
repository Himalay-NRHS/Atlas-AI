import type { Message } from "@/lib/hooks/use-chat"
import { cn } from "@/lib/utils"
import { User, Bot } from "lucide-react"

interface MessageItemProps {
  message: Message
}

export default function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex items-start gap-3 max-w-[80%]", isUser ? "ml-auto" : "mr-auto")}>
      <div
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full shrink-0",
          isUser ? "bg-emerald-100 text-emerald-600 order-2" : "bg-purple-100 text-purple-600 order-1",
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div
        className={cn(
          "rounded-lg px-4 py-2 text-sm",
          isUser
            ? "bg-emerald-600 text-white order-1"
            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 order-2",
        )}
      >
        {message.content}
      </div>
    </div>
  )
}

