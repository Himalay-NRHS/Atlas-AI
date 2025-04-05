// app/api/quiz/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    // Parse the incoming JSON request
    const { topic } = await req.json();
    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    // Construct the Gemini prompt for generating quiz data
    const prompt = `
You are an AI quiz generator. Given the topic '${topic}', generate exactly 10 quiz questions with four options each. Provide your output as a JSON with three keys:
- questions: an array of 10 question strings
- options: an object with a key "choices" that is an array of 10 arrays (each inner array contains four answer options)
- answers: an array of 10 numbers corresponding to the correct option index for each question
Make sure your output matches this structure exactly and no additional text is added.
    `;

    // Initialize the GoogleGenAI client with your Gemini API key
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Call the Gemini API using the flash model
    const geminiResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    console.log("Gemini API response:", geminiResponse);

    // Ensure we got a valid response text
    if (!geminiResponse || !geminiResponse.text) {
      return NextResponse.json({ error: 'Failed to get a valid response from Gemini API' }, { status: 500 });
    }

    // Remove Markdown formatting if present (e.g., triple backticks)
    let jsonStr = geminiResponse.text.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?/, "").replace(/```$/, "").trim();
    }

    // Parse the response text as JSON
    let parsedData: any;
    try {
      parsedData = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse quiz JSON:', parseError);
      return NextResponse.json({ error: 'Failed to parse Gemini API response as JSON' }, { status: 500 });
    }

    // If Gemini wraps the data in a "quizData" key, extract it
    const quizData = parsedData.quizData ? parsedData.quizData : parsedData;

    // Format the data to ensure it exactly matches the required structure
    const formattedQuizData = {
      questions: quizData.questions,
      options: {
        choices: quizData.options && quizData.options.choices ? quizData.options.choices : [],
      },
      answers: quizData.answers,
    };

    // Return the formatted quiz data to the frontend
    return NextResponse.json(formattedQuizData);
  } catch (error) {
    console.error("Quiz generation error:", error);
    return NextResponse.json({ error: 'Failed to process quiz request' }, { status: 500 });
  }
}
