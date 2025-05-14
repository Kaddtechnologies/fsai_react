
'use server';
/**
 * @fileOverview Generates a chat response from an AI model.
 *
 * - generateChatResponse - A function that generates an AI chat response.
 * - GenerateChatResponseInput - The input type for the generateChatResponse function.
 * - GenerateChatResponseOutput - The return type for the generateChatResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'ai']), // Consistent with Gemini's roles, system messages are handled in the prompt itself.
  content: z.string(),
});

const GenerateChatResponseInputSchema = z.object({
  userInput: z.string().describe('The latest message from the user.'),
  history: z.array(MessageSchema).optional().describe('The preceding conversation history (excluding the current userInput).'),
});
export type GenerateChatResponseInput = z.infer<typeof GenerateChatResponseInputSchema>;

const GenerateChatResponseOutputSchema = z.object({
  aiResponse: z.string().describe('The AI-generated response to the user.'),
});
export type GenerateChatResponseOutput = z.infer<typeof GenerateChatResponseOutputSchema>;

export async function generateChatResponse(input: GenerateChatResponseInput): Promise<GenerateChatResponseOutput> {
  return generateChatResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateChatResponsePrompt',
  input: {schema: GenerateChatResponseInputSchema},
  output: {schema: GenerateChatResponseOutputSchema},
  prompt: `You are FlowserveAI, a helpful and intelligent assistant for Flowserve, a company specializing in industrial pumps, seals, valves, and related flow control solutions.

Your capabilities include:
- Answering questions about Flowserve products (e.g., pumps, valves, seals, actuators, digital positioners).
- Providing information based on product specifications or descriptions.
- Assisting with document understanding and summarization (file processing is handled by other functions, you can discuss summaries).
- Engaging in general conversation.

When a user asks to "search products for X" or "find Y products", another part of the system handles that specific query type. Your response should be natural based on the user's query and the context; do not attempt to perform the product search yourself here.

{{#if history}}
Here is the conversation history so far:
{{#each history}}
{{this.role}}: {{this.content}}
{{/each}}
{{/if}}

User's current message: {{{userInput}}}

Your response (FlowserveAI):
  `,
});

const generateChatResponseFlow = ai.defineFlow(
  {
    name: 'generateChatResponseFlow',
    inputSchema: GenerateChatResponseInputSchema,
    outputSchema: GenerateChatResponseOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
        // This case should ideally be handled by Zod schema validation if the model returns an unexpected structure.
        // For a missing text response, provide a fallback.
        console.error('AI response output was null or undefined.');
        return { aiResponse: "I'm sorry, I couldn't generate a response at this moment." };
    }
    return output;
  }
);
