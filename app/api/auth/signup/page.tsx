"use client"

import type React from "react"
import axios from "axios"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SignUpPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [stdclass, setStdclass] = useState("") // <-- New stdclass field
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const res = await axios.post("/api/signup", {
        name: username,
        email,
        password,
        stdclass, // <-- Send stdclass to backend
      })

      console.log(res)

      setIsLoading(false)
      router.push("/api/auth/signin")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md space-y-8 border border-gray-200 rounded-lg p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
          <p className="mt-2 text-sm text-gray-600">Sign up to get started with our platform</p>
        </div>

        {error && (
          <Alert variant="destructive" className="bg-red-50 text-red-900 border-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSignUp} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="johndoe"
              required
              className="border-gray-300 focus:border-black focus:ring-black"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="border-gray-300 focus:border-black focus:ring-black"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stdclass">Class</Label>
            <Input
              id="stdclass"
              value={stdclass}
              onChange={(e) => setStdclass(e.target.value)}
              placeholder="e.g. 10th Grade or BCA 2nd Year"
              required
              className="border-gray-300 focus:border-black focus:ring-black"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-gray-300 focus:border-black focus:ring-black"
            />
            <p className="text-xs text-gray-500">Password must be at least 8 characters long</p>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full bg-black hover:bg-gray-800 text-white">
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link href="/api/auth/signin" className="font-medium text-black hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
