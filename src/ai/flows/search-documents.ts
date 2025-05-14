// src/ai/flows/search-documents.ts
'use server';

/**
 * @fileOverview A document search AI agent.
 *
 * - searchDocuments - A function that handles the document search process.
 * - SearchDocumentsInput - The input type for the searchDocuments function.
 * - SearchDocumentsOutput - The return type for the searchDocuments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SearchDocumentsInputSchema = z.object({
  query: z.string().describe('The search query.'),
  documentCollection: z.string().describe('The collection of documents to search through.'),
});
export type SearchDocumentsInput = z.infer<typeof SearchDocumentsInputSchema>;

const SearchDocumentsOutputSchema = z.object({
  results: z.array(
    z.object({
      documentId: z.string().describe('The ID of the document.'),
      relevanceScore: z.number().describe('The relevance score of the document to the query.'),
      snippet: z.string().describe('A snippet of the document that is relevant to the query.'),
    })
  ).describe('The search results.'),
});

export type SearchDocumentsOutput = z.infer<typeof SearchDocumentsOutputSchema>;

export async function searchDocuments(input: SearchDocumentsInput): Promise<SearchDocumentsOutput> {
  return searchDocumentsFlow(input);
}

const searchDocumentsPrompt = ai.definePrompt({
  name: 'searchDocumentsPrompt',
  input: {schema: SearchDocumentsInputSchema},
  output: {schema: SearchDocumentsOutputSchema},
  prompt: `You are a search assistant that helps users find relevant information in their documents.

  Given the following query, search through the document collection and return the most relevant documents.

  Query: {{{query}}}
  Document Collection: {{{documentCollection}}}
  `,
});

const searchDocumentsFlow = ai.defineFlow(
  {
    name: 'searchDocumentsFlow',
    inputSchema: SearchDocumentsInputSchema,
    outputSchema: SearchDocumentsOutputSchema,
  },
  async input => {
    const {output} = await searchDocumentsPrompt(input);
    return output!;
  }
);
