import { NextRequest, NextResponse } from 'next/server';
import { generateWithDeepseek } from '@/lib/together-ai';

export async function POST(req: NextRequest) {
  try {
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
    return NextResponse.json(
      { error: 'Failed to generate text' },
      { status: 500 }
    );
  }
} 