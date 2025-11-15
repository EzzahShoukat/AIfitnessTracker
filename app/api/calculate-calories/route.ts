import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(request: NextRequest) {
  try {
    const { workoutType, duration } = await request.json();

    if (!workoutType || !duration) {
      return NextResponse.json(
        { error: "Workout type and duration are required" },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is not set in environment variables");
      return NextResponse.json(
        { error: "Groq API key is not configured" },
        { status: 500 }
      );
    }

    // Initialize Groq client with API key
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    // Create a prompt for the AI to calculate calories
    const prompt = `Calculate calories burned for ${workoutType} for ${duration} minutes.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a fitness expert. Calculate calories burned based on workout type and duration using MET values. Respond ONLY in this exact format: 'Calories: [number]' followed by a single brief sentence explanation. Keep it very short.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 80,
    });

    const result = completion.choices[0]?.message?.content || "Unable to calculate calories.";

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error("Error calling Groq API:", error);
    
    // Return more specific error messages
    let errorMessage = "Failed to calculate calories. Please try again.";
    if (error?.message) {
      errorMessage = error.message;
    } else if (error?.error?.message) {
      errorMessage = error.error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

