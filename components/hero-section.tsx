"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28 px-4 bg-gradient-to-br from-white via-gray-50 to-purple-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 mb-6">
              Your Personal AI Mentor, Available <span className="text-primary">24/7</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg">
              Transform your learning experience with personalized AI mentors that adapt to your unique needs and help
              you achieve your educational goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="rounded-full text-lg px-8 py-6">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="mt-8 flex items-center text-gray-500">
              {/* <div className="flex -space-x-2 mr-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden"
                  >
                    <img
                      src={`/placeholder.svg?height=40&width=40`}
                      alt={`User ${i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div> */}
              {/* <p>
                <span className="font-semibold text-primary">5,000+</span> students already enrolled
              </p> */}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="relative z-10 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="p-1 bg-gradient-to-r from-primary to-purple-500">
                <div className="bg-white p-6 rounded-t-xl">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <span className="text-primary font-bold">AI</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Math Mentor</h3>
                      <p className="text-xs text-gray-500">Online • Ready to help</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                      <p className="text-sm">I'm having trouble understanding quadratic equations. Can you help me?</p>
                    </div>
                    <div className="bg-primary/10 rounded-lg p-3 ml-auto max-w-[80%]">
                      <p className="text-sm">
                        Of course! Quadratic equations are in the form ax² + bx + c = 0. Let me explain how to solve
                        them step by step...
                      </p>
                    </div>
                    <div className="bg-primary/10 rounded-lg p-3 ml-auto max-w-[80%]">
                      <p className="text-sm">
                        Would you like me to create a practice quiz on this topic to help you master it?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 flex items-center">
                <input
                  type="text"
                  placeholder="Ask your question..."
                  className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none"
                />
                <Button size="sm" className="ml-2 rounded-full w-8 h-8 p-0">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-300 rounded-full opacity-30 blur-xl"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary rounded-full opacity-20 blur-xl"></div>
            <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-8 h-40 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full opacity-20 blur-md"></div>
          </motion.div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute left-0 right-0 bottom-0 h-16 bg-white">
        <svg
          className="absolute bottom-0 w-full h-16 text-white"
          preserveAspectRatio="none"
          viewBox="0 0 1440 74"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0,0 C240,70 480,70 720,40 C960,10 1200,10 1440,40 L1440,74 L0,74 Z" />
        </svg>
      </div>
    </section>
  )
}

