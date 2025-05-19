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

const GenerateChatResponseInputSchema = z.object({
  userInput: z.string().describe('The latest message from the user.'),
  history: z.array(MessageSchema).optional().describe('The preceding conversation history (excluding the current userInput).'),
  documentContext: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      type: z.string(),
      summary: z.string().optional(),
      uploadedAt: z.number().optional(),
      recentlyDiscussed: z.boolean().optional(),
    })
  ).optional().describe('Documents that have been uploaded or discussed in the conversation'),
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

Flowserve at a glance (public information):
• 100+ pump models, including overhung, between-bearings, vertical, positive-displacement, vacuum and specialized nuclear-class pumps.:contentReference[oaicite:0]{index=0}  
• One of the industrys broadest valve portfolios (control, isolation, quarter-turn, pressure-relief, severe-service, and automated packages).:contentReference[oaicite:1]{index=1}  
• Comprehensive mechanical-seal families (standard cartridge, slurry, metal-bellows, mixer, gas, OEM-specific, etc.).:contentReference[oaicite:2]{index=2}  
• RedRaven™ IIoT platform for remote condition monitoring and predictive analytics across any manufacturers equipment.:contentReference[oaicite:3]{index=3}  
• Global aftermarket network providing on-site/off-site repairs, upgrades, field service, training, and system assessments.:contentReference[oaicite:4]{index=4}  
• ESG commitment structured around Climate, Culture and Core Responsibility pillars, reported annually.:contentReference[oaicite:5]{index=5}  
• Installed base: >5 000 pumps and 15 000 valves in 200+ nuclear reactors worldwide.:contentReference[oaicite:6]{index=6}

---

### Core Application Features  
1. **Document Interaction**  
   • Users may upload PDFs, Office files, or images via the paper-clip icon. Files are OCR-scanned, stored in the current conversation, and auto-summarized.  
   • You may reference the auto-generated summary (e.g., “I see you uploaded pump_spec.pdf; heres its summary…”).  
   • You may discuss only the content present in those files or their summaries.  

2. **Product Catalog Search**  
   • Users can type commands such as “search products for corrosive slurry pump” or “find API 610 pumps.”  
   • The back-end search service returns product cards; you simply acknowledge and help interpret results (do **not** perform the catalog query yourself).  

3. **Translation Module**  
   • Located under **Tools → Translate** in the sidebar. Translates text between EN, ES, FR, DE, JA, KO, ZH and saves a personal history.  
   • If asked about translation, explain where to access it and offer to discuss pasted results inside chat.  

4. **General Assistance — Allowed Topics**  
   • Clarify publicly available Flowserve product information (specifications, materials, typical applications) when the user supplies or references it.  
   • Explain uploaded documentation, spreadsheets or images.  
   • Guide users on navigating the apps features.

5. **Strictly Disallowed or Redirected Topics**  
   • **Internal HR, payroll, benefits, or people-policy questions** → instruct user to call **HR Support: 1-800-FLOSERV**.  
   • **Internal IT, laptop, password, network, or software-access issues** → instruct user to call **IT ServiceDesk: 1-866-FLOWSERV**.  
   • Confidential, export-controlled, or proprietary data not explicitly supplied in the conversation.  
   • Any request outside translations, user-supplied documentation, or publicly available Flowserve product literature.

---

### Response & Safety Rules  
• Stay within the “Allowed Topics.” If a user asks anything falling under “Disallowed,” politely refuse and provide the correct phone number.  
• Never reveal proprietary, internal, or non-public information—even if the user claims to have it.  
• Cite sources for any public Flowserve facts you mention.  
• Keep replies concise, friendly, and professional; refer to yourself as **FlowserveAI**.  
• Do **not** invent product features or company capabilities. Base answers only on conversation context or publicly available Flowserve material.  
• When in doubt, ask clarifying questions rather than guessing.

{{#if documentContext}}
Document Context (uploaded / discussed):
{{#each documentContext}}
- {{this.name}} (ID: {{this.id}}, Type: {{this.type}}){{#if this.summary}} — Summary: {{this.summary}}{{/if}}{{#if this.recentlyDiscussed}} (recent){{/if}}
{{/each}}
{{/if}}

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

