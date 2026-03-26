import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured in .env.local" }, 
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const systemPrompt = "You are Raksha AI, an empathetic, highly knowledgeable, and multilingual safety advocate for women. Your primary goal is to provide immediate, actionable safety advice, explain legal rights clearly, and offer emotional support. You must automatically detect the user's language based on their input and reply in that EXACT same language fluently. Keep your replies concise, supportive, and profoundly focused on women's safety.";
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: {
        role: "system",
        parts: [{ text: systemPrompt }]
      }
    });
    
    // Convert standard chat message format to Gemini format
    let history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    // Gemini requires the first message in history to be from 'user'
    // Remove any leading 'model' messages
    while (history.length > 0 && history[0].role !== 'user') {
      history.shift();
    }
    
    const lastMessage = messages[messages.length - 1].content;

    const chat = model.startChat({
      history: history,
    });

    const result = await chat.sendMessage(lastMessage);
    const text = result.response.text();

    return NextResponse.json({ reply: text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch response" }, { status: 400 });
  }
}
