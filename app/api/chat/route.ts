import { openai } from '@ai-sdk/openai';
import { StreamingTextResponse, streamText } from 'ai';

export async function POST(req: Request) {
    const { messages } = await req.json();

    const result = await streamText({
        /**
         * @description What's the difference among the models?
         * @link https://platform.openai.com/docs/models/gpt-3-5-turbo
         */
        model: openai("gpt-3.5-turbo-0125"),
        messages,
    });

    return new StreamingTextResponse(result.toAIStream());
}