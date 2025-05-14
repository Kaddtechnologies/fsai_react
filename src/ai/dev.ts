
import { config } from 'dotenv';
config();

import '@/ai/flows/translate-text.ts';
import '@/ai/flows/generate-chat-title.ts';
import '@/ai/flows/search-documents.ts';
import '@/ai/flows/summarize-document.ts';
import '@/ai/flows/generate-chat-response.ts'; // Added new flow
