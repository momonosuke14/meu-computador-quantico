import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';

// Isso permite que o Vercel rode esse código em "Edge", ou seja, muito rápido!
export const runtime = 'edge';

export async function POST(req: Request) {
  // Recebemos a mensagem, qual IA o usuário quer, e a estabilidade do HyperQubitX
  const { messages, modelType, stability } = await req.json();

  // Mapeamento de Provedores
  const models: any = {
    'gemini': google('models/gemini-1.5-pro-latest'),
    'gpt': openai('gpt-4-turbo'),
    'gemma': groq('gemma2-9b-it'),
  };

  // Aqui está a mágica: o prompt muda conforme a estabilidade do seu ímã!
  const systemPrompt = `
    Você é um núcleo de IA integrado ao sistema OBJECTUM X. 
    Status de Estabilidade Quântica: ${stability * 100}%.
    Se a estabilidade estiver baixa, responda de forma técnica e urgente.
    Se estiver alta, responda de forma harmônica e calma.
  `;

  // Faz a chamada para a IA selecionada
  const result = await streamText({
    model: models[modelType] || models['gemini'],
    system: systemPrompt,
    messages,
  });

  // Retorna a resposta em tempo real (Streaming) para o seu site
  return result.toAIStreamResponse();
}