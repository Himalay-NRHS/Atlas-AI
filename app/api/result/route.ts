// app/api/result/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { topic, incorrectQuestions, totalQuestions, email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Construct the prompt for Gemini
    const prompt = `
You are an professional educational teacher. A student took a quiz on "${topic}" and answered some questions incorrectly.
Here are the questions that were answered incorrectly:
${incorrectQuestions}

Please analyze these questions and determine which topics the student is weak in. Then, provide clear suggestions on how the student can improve and list out the weak topics in an array. Give suggestion in a friendly and polite manner and specify the topics on which the student should focus more.

Respond strictly in JSON format as:
{
  "suggestion": "the actual suggestion",
  "topics": ["topic1", "topic2", ...]
}
    `;

    // Initialize the GoogleGenAI client with your Gemini API key
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const geminiResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    console.log("Gemini Response:", geminiResponse);

    if (!geminiResponse || !geminiResponse.text) {
      return NextResponse.json(
        { error: "Failed to get a valid response from Gemini API" },
        { status: 500 }
      );
    }

    // Retrieve the raw response text and remove any markdown formatting if present
    let responseText = geminiResponse.text.trim();
    if (responseText.startsWith("```")) {
      responseText = responseText.replace(/^```(?:json)?/, "").replace(/```$/, "").trim();
    }

    // Parse the response text into JSON
    let resultData;
    try {
      resultData = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", parseError);
      return NextResponse.json(
        { error: "Failed to parse Gemini API response" },
        { status: 500 }
      );
    }

    // Pretty-print the JSON with indentation
    const formattedResponse = JSON.stringify(resultData, null, 2);

    // Optionally, update the user record in the DB if you have logic to extract topics
    // For now, we're only returning the formatted response

    // Return the formatted Gemini response to the frontend
    return NextResponse.json({ suggestion: formattedResponse });
  } catch (error) {
    console.error("Error in result route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
