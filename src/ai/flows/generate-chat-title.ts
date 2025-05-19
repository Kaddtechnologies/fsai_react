// use server'
'use server';

/**
 * @fileOverview Generates a chat title based on the first message.
 *
 * - generateChatTitle - A function that generates a chat title.
 * - GenerateChatTitleInput - The input type for the generateChatTitle function.
 * - GenerateChatTitleOutput - The return type for the generateChatTitle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateChatTitleInputSchema = z.object({
  firstMessage: z
    .string()
    .describe('The first message of the chat session.'),
  messages: z
    .array(z.object({
      content: z.string(),
      isDocument: z.boolean().optional(),
    }))
    .describe('All messages in the chat session.')
    .optional(),
});
export type GenerateChatTitleInput = z.infer<typeof GenerateChatTitleInputSchema>;

const GenerateChatTitleOutputSchema = z.object({
  title: z.string().describe('The generated title for the chat session.'),
});
export type GenerateChatTitleOutput = z.infer<typeof GenerateChatTitleOutputSchema>;

export async function generateChatTitle(input: GenerateChatTitleInput): Promise<GenerateChatTitleOutput> {
  return generateChatTitleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateChatTitlePrompt',
  input: {schema: GenerateChatTitleInputSchema},
  output: {schema: GenerateChatTitleOutputSchema},
  prompt: `You are an expert at generating concise and descriptive titles for chat sessions based on the first message.

  Generate a title that captures the essence of the conversation.

  First Message: {{{firstMessage}}}
  `,
});

const generateChatTitleFlow = ai.defineFlow(
  {
    name: 'generateChatTitleFlow',
    inputSchema: GenerateChatTitleInputSchema,
    outputSchema: GenerateChatTitleOutputSchema,
  },
  async input => {
    // If the first message is a document and we have additional messages
    if (input.messages && input.messages.length > 0) {
      const firstMessageIsDocument = input.messages[0].isDocument === true;
      
      if (firstMessageIsDocument) {
        // Look for the first non-document message
        for (let i = 1; i < input.messages.length; i++) {
          if (input.messages[i].isDocument !== true) {
            // Use this message for title generation instead
            input = { ...input, firstMessage: input.messages[i].content };
            break;
          }
        }
      }
    }
    
    const {output} = await prompt(input);
    return output!;
  }
);
