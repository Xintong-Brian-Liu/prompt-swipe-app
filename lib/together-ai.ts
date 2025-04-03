import Together from 'together-ai';

// Initialize Together AI client
export const togetherClient = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});

// DeepSeek model ID
export const DEEPSEEK_MODEL_ID = 'deepseek-ai/DeepSeek-V3';

// Function to generate text from DeepSeek model
export async function generateWithDeepseek(prompt: string) {
  try {
    const response = await togetherClient.chat.completions.create({
      model: DEEPSEEK_MODEL_ID,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1024,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error generating text with DeepSeek:', error);
    throw error;
  }
} 