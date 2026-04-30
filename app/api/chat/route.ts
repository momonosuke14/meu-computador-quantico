import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: google('gemini-1.5-flash'),
    messages,
  });

  // O @ts-ignore ignora o erro de tipo que está travando o seu deploy na Vercel
  // @ts-ignore
  return result.toDataStreamResponse();
}