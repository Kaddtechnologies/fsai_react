'use server';
/**
 * @fileOverview AI flow for having in-depth discussions about uploaded documents.
 *
 * - discussDocument - A function that enables interactive document discussions.
 * - DiscussDocumentInput - The input type for the discussDocument function.
 * - DiscussDocumentOutput - The return type for the discussDocument function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import * as DocumentService from '@/lib/services/document-service';

const MessageSchema = z.object({
  role: z.enum(['user', 'ai']),
  content: z.string(),
});

const DocumentReferenceSchema = z.object({
  id: z.string().describe('Document ID'),
  name: z.string().describe('Document name'),
  summary: z.string().optional().describe('Document summary'),
  type: z.string().describe('Document type (pdf, word, excel, etc.)'),
  content: z.string().optional().describe('Full or partial document content')
});

const DiscussDocumentInputSchema = z.object({
  userQuery: z.string().describe('The user query or question about the document'),
  activeDocumentIds: z.array(z.string()).describe('IDs of documents currently active in the conversation'),
  conversationHistory: z.array(MessageSchema).optional().describe('Previous messages in the conversation'),
  documentReferences: z.array(DocumentReferenceSchema).describe('Document content and metadata to reference')
});
export type DiscussDocumentInput = z.infer<typeof DiscussDocumentInputSchema>;

const DiscussDocumentOutputSchema = z.object({
  response: z.string().describe('The AI response discussing the document content'),
  referencedDocumentIds: z.array(z.string()).describe('IDs of documents referenced in the response'),
  confidence: z.number().min(0).max(1).describe('Confidence score for the response quality (0-1)'),
  requestsAdditionalContext: z.boolean().describe('Whether the AI needs more document context to answer fully')
});
export type DiscussDocumentOutput = z.infer<typeof DiscussDocumentOutputSchema>;

export async function discussDocument(input: DiscussDocumentInput): Promise<DiscussDocumentOutput> {
  return discussDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'discussDocumentPrompt',
  input: { schema: DiscussDocumentInputSchema },
  output: { schema: DiscussDocumentOutputSchema },
  prompt: `You are an expert document analyst and consultant for FlowserveAI, specializing in providing insights, analysis, and recommendations based on documents.

Your task is to engage in an in-depth discussion about one or more documents that have been uploaded. You should provide detailed, accurate responses based on document content and maintain context throughout the conversation.

## Document Context
{{#each documentReferences}}
---
DOCUMENT: {{this.name}} (ID: {{this.id}})
TYPE: {{this.type}}
{{#if this.summary}}SUMMARY: {{this.summary}}{{/if}}
{{#if this.content}}CONTENT: {{this.content}}{{/if}}
---
{{/each}}

## Previous Conversation
{{#if conversationHistory}}
{{#each conversationHistory}}
{{this.role}}: {{this.content}}
{{/each}}
{{/if}}

## User Query
{{{userQuery}}}

## Instructions
1. Base your response primarily on the document content provided
2. If the user's query refers to specific parts of the document, address those directly
3. If the document is technical, provide explanations in clear, accessible language
4. If asked for recommendations or insights, provide thoughtful analysis beyond simple fact extraction
5. If the document contains numerical data, consider providing interpretations or calculations when relevant
6. If the query can't be fully answered with the available content, note what additional information would be needed
7. Format your response appropriately - use lists, bold text, or other formatting to enhance readability
8. Maintain professional tone throughout your response

Your response should be comprehensive yet concise, focusing on directly addressing the user's query with the most relevant information from the document(s).`,
});

const discussDocumentFlow = ai.defineFlow(
  {
    name: 'discussDocumentFlow',
    inputSchema: DiscussDocumentInputSchema,
    outputSchema: DiscussDocumentOutputSchema,
  },
  async (input) => {
    // Prepare document content if needed
    const enhancedDocumentReferences = await Promise.all(
      input.documentReferences.map(async (docRef) => {
        // If we don't have content yet but have document ID, try to fetch it
        if (!docRef.content && docRef.id) {
          try {
            const docWithContext = DocumentService.findDocumentById(docRef.id);
            if (docWithContext) {
              const textContent = await DocumentService.getDocumentTextContent(docWithContext.document);
              if (textContent) {
                return { 
                  ...docRef, 
                  content: textContent.slice(0, 15000) // Limit content size to prevent token issues
                };
              }
            }
          } catch (error) {
            console.error(`Error fetching content for document ${docRef.id}:`, error);
          }
        }
        return docRef;
      })
    );

    // Send to AI
    try {
      const { output } = await prompt({
        ...input,
        documentReferences: enhancedDocumentReferences
      });

      if (!output) {
        return {
          response: "I'm sorry, I couldn't analyze the document content properly. Please try again or provide more specific questions about the document.",
          referencedDocumentIds: input.activeDocumentIds,
          confidence: 0.1,
          requestsAdditionalContext: false
        };
      }

      return output;
    } catch (error) {
      console.error("Error in document discussion flow:", error);
      return {
        response: "I encountered an error while analyzing the document. This might be due to the document format or content length. Could you try asking about a specific section or provide more context?",
        referencedDocumentIds: input.activeDocumentIds,
        confidence: 0.1,
        requestsAdditionalContext: true
      };
    }
  }
); 