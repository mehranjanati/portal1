import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

const openai = createOpenAI({
    apiKey: env.OPENAI_API_KEY
});

export const POST: RequestHandler = async ({ request }) => {
    const { messages } = await request.json();

    const result = streamText({
        model: openai('gpt-4-turbo'),
        messages,
    });

    return result.toDataStreamResponse();
};
