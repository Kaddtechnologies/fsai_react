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
import * as DocumentService from '@/lib/services/document-service';
import { discussDocument } from './discuss-document';
import { Document, Message } from '@/lib/types';

const MessageSchema = z.object({
  role: z.enum(['user', 'ai']), 
  content: z.string(),
    documentIds: z.array(z.string()).optional(),
    
});

const ProjectContextSchema = z.object({
    name: z.string().describe("The name of the project this chat belongs to."),
    fileSummaries: z.string().describe("A concatenation of summaries from all documents uploaded to this project. Each summary is separated by '---'.")
}).optional();


const GenerateChatResponseInputSchema = z.object({
  userInput: z.string().describe('The latest message from the user.'),
  history: z.array(MessageSchema).optional().describe('The preceding conversation history (excluding the current userInput).'),
  projectContext: ProjectContextSchema,
});
export type GenerateChatResponseInput = z.infer<typeof GenerateChatResponseInputSchema>;

const GenerateChatResponseOutputSchema = z.object({
  aiResponse: z.string().describe('The AI-generated response to the user.'),
  referencedDocumentIds: z.array(z.string()).optional().describe('IDs of documents referenced in the response'),
});
export type GenerateChatResponseOutput = z.infer<typeof GenerateChatResponseOutputSchema>;

export async function generateChatResponse(input: GenerateChatResponseInput): Promise<GenerateChatResponseOutput> {
  return generateChatResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateChatResponsePrompt',
  input: {schema: GenerateChatResponseInputSchema},
  output: {schema: GenerateChatResponseOutputSchema},
  prompt: `You are **FlowserveAI**, a helpful, professional assistant for Flowserve — a global manufacturer and service provider of industrial **pumps, valves, mechanical seals, automation/actuation, and aftermarket flow-control services** that span oil & gas, chemical, power (including nuclear), water, and general-industry markets. Your primary interface is this chat window.

{{#if projectContext}}
You are currently in a chat within a project called "{{projectContext.name}}". Your primary goal is to answer questions and discuss topics based on the knowledge provided in the project's uploaded documents. Use the summaries below as your main source of information.

Project Knowledge (File Summaries):
{{{projectContext.fileSummaries}}}
---
{{else}}
Core Application Features:
- **Document Interaction:**
  - Users can upload documents (PDFs, Excel files, images) by clicking the paperclip icon next to the message input area.
  - Upon upload, documents are processed: images and PDFs undergo OCR, and all documents have a summary generated automatically. This summary appears in the chat.
  - You can discuss the content of uploaded documents and their summaries with the user. For example, if a user uploads 'report.pdf', you can say "I see you've uploaded 'report.pdf'. Its summary is available. What would you like to discuss about it?".
  - Uploaded documents and their summaries are part of the current conversation context.
- **Product Catalog:**
  - Users can ask you to search the product catalog using phrases like "search products for X" or "find Y products". Another part of the system handles the actual search and displays product cards. Your role is to acknowledge the request naturally if it's part of a broader conversation. You do not perform the product search yourself in this flow.
- **Translation Module:**
  - The application has a dedicated "Translate" section, accessible from the "Tools" menu in the sidebar. This tool allows users to translate text between various languages (e.g., English, Spanish, French, German, Japanese, Korean, Chinese) and maintains a history of their translations.
  - If a user asks about translation capabilities, you can inform them about this module and suggest they navigate to it for direct translation tasks. You can answer general questions about its existence and purpose, and mention that you can discuss any translations they perform there if they paste them into the chat.
- **General Chat & Assistance:**
  - You can answer questions about Flowserve products (e.g., pumps, valves, seals, actuators, digital positioners).
  - You can provide information based on product specifications or descriptions if the user provides them or if they are part of the conversation history.
  - You can engage in general conversation related to Flowserve's domain or assist with understanding information presented in the chat.
{{/if}}

Your Goal:
Provide concise, helpful, and contextually-aware responses. When asked about application features, explain them clearly and guide the user on how to use them. Do not invent features. Base your product knowledge on information provided in the conversation or general knowledge if applicable.

Conversation Style:
- Friendly and professional.
- Refer to yourself as FlowserveAI.

{{#if history}}
Conversation History (latest last):
{{#each history}}
{{this.role}}: {{this.content}}
{{/each}}
{{/if}}

User’s message: {{{userInput}}}

Your response (FlowserveAI):

  `,
});

// Helper function to determine if a query is about a document
function isDocumentQuery(
  userInput: string, 
  history: { role: string; content: string; documentIds?: string[] }[] = [],
  documentContext: { id: string; name: string; recentlyDiscussed?: boolean }[] = []
): { isAboutDocument: boolean; documentIds: string[] } {
  // Lowercase the input for easier matching
  const input = userInput.toLowerCase();
  
  // Check for explicit document references
  const recentlyDiscussedDocs = documentContext
    .filter(doc => doc.recentlyDiscussed)
    .map(doc => doc.id);
  
  // Check explicit mentions in the latest messages (last 3)
  const recentDocMentions = history
    .slice(-3)
    .flatMap(msg => msg.documentIds || []);
  
  // Common phrases that indicate document questions
  const documentPhrases = [
    'in the document', 'from the document', 'the document says', 'document mentions',
    'according to the document', 'based on the document', 'in this file', 'from the file',
    'in the pdf', 'in the report', 'in the spreadsheet', 'according to the report',
    'what does the document', 'tell me about the document', 'summarize the document',
    'what is in the document', 'can you explain the document', 'analyze the document',
    'extract from the document', 'key points in the document', 'document content',
    'insights from the document', 'findings in the document', 'document analysis',
    'document summary', 'document details', 'highlights from the document',
    'what is in the file', 'can you explain the file', 'analyze the file',
    'extract from the file', 'key points in the file', 'file content',
    'insights from the file', 'findings in the file', 'file analysis',
    'file summary', 'file details', 'highlights from the file',
  ];
  
  // Check if any document phrases are in the input
  const hasDocumentPhrase = documentPhrases.some(phrase => input.includes(phrase));
  
  // Check for document name mentions in the user input
  const mentionedDocNames = documentContext
    .filter(doc => input.includes(doc.name.toLowerCase()))
    .map(doc => doc.id);
  
  // Combine all potential document IDs
  const potentialDocIds = [...new Set([
    ...recentlyDiscussedDocs,
    ...recentDocMentions,
    ...mentionedDocNames
  ])];
  
  return {
    isAboutDocument: hasDocumentPhrase || potentialDocIds.length > 0,
    documentIds: potentialDocIds
  };
}

const generateChatResponseFlow = ai.defineFlow(
  {
    name: 'generateChatResponseFlow',
    inputSchema: GenerateChatResponseInputSchema,
    outputSchema: GenerateChatResponseOutputSchema,
  },
  async (input) => {
    // Check if this is a document-related query
    const documentQueryAnalysis = isDocumentQuery(
      input.userInput, 
      input.history, 
      input.documentContext
    );
    
    // If it's a document query and we have document IDs, use the document discussion flow
    if (documentQueryAnalysis.isAboutDocument && documentQueryAnalysis.documentIds.length > 0) {
      try {
        // Prepare document references
        const documentReferences = await Promise.all(
          documentQueryAnalysis.documentIds.map(async (docId) => {
            const docWithContext = DocumentService.findDocumentById(docId);
            if (!docWithContext) return null;
            
            return {
              id: docId,
              name: docWithContext.document.name,
              summary: docWithContext.document.summary,
              type: docWithContext.document.type,
              // We don't include full content here - the discuss-document flow will fetch it if needed
            };
          })
        ).then(refs => refs.filter((ref): ref is NonNullable<typeof ref> => ref !== null));
        
        if (documentReferences.length > 0) {
          // Prepare conversation history
          const conversationHistory = input.history?.map(msg => ({
            role: msg.role,
            content: msg.content
          })) || [];
          
          // Call the document discussion flow
          const documentDiscussion = await discussDocument({
            userQuery: input.userInput,
            activeDocumentIds: documentQueryAnalysis.documentIds,
            conversationHistory,
            documentReferences
          });
          
          return {
            aiResponse: documentDiscussion.response,
            referencedDocumentIds: documentDiscussion.referencedDocumentIds
          };
        }
      } catch (error) {
        console.error("Error calling document discussion flow:", error);
        // Fall back to standard response generation
      }
    }
    
    // Standard response generation for non-document queries
    const {output} = await prompt(input);
    if (!output) {
        console.error('AI response output was null or undefined from prompt.');
        return { aiResponse: "I'm sorry, I couldn't generate a response at this moment. Please try again." };
    }
    return output;
  }
);
