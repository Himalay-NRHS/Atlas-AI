// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    // Parse the incoming JSON request
    const { message, context, email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Fetch user's weak topics from the database
    const user = await prisma.user.findUnique({
      where: { email },
      select: { weaktopics: true }
    });
    const weakTopics = user?.weaktopics || [];

    // Build the prompt with the required instructions and the incoming message
    const prompt = `
Assume you are a professional teacher helping a dear student who is weak in ${
  weakTopics.join(", ") || "None"
}. Your task is to provide the best possible answer to the question asked below. Keep your explanation very simple, friendly, and clear, and also mention the student's weakness in that subject.


Student Question: ${message}
    `;

    // Initialize the GoogleGenAI client with your API key
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Send the prompt to the Gemini API using the correct property name ("prompt")
    const geminiResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    console.log("Gemini API response:", geminiResponse);

    // Check that we have a valid response
    if (!geminiResponse || !geminiResponse.text) {
      return NextResponse.json(
        { error: 'Failed to get a valid response from Gemini API' },
        { status: 500 }
      );
    }

    // Extract the text from the response before returning
    const textResponse = geminiResponse.text; // ✅ Correct


    // Return the response from Gemini to the frontend
    return NextResponse.json({ response: textResponse });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}