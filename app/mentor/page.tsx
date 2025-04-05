"use client"

import Chat from "@/components/chat"
import type { Metadata } from "next"
import { SessionProvider } from "next-auth/react";




export default function Home() {
  return (
    <main className="flex flex-col h-screen bg-white text-zinc-800 overflow-hidden">
      <SessionProvider>
      <Chat />
      </SessionProvider>
    </main>
  )
}

