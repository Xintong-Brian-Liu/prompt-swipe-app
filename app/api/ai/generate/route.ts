import { NextRequest, NextResponse } from 'next/server';
import { generateWithDeepseek } from '@/lib/together-ai';

export async function POST(req: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.TOGETHER_API_KEY) {
      return NextResponse.json(
        { error: 'Together AI API key is not configured' },
        { status: 500 }
      );
    }

    const { prompt, conversation } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required and must be a string' },
        { status: 400 }
      );
    }

    // If conversation history is provided, use it to maintain context
    const messages = conversation 
      ? [...conversation, { role: 'user', content: prompt }]
      : [{ role: 'user', content: prompt }];

    const response = await generateWithDeepseek(prompt, messages);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in AI generate API:', error);
    
    // Return a more specific error message
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate text';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 