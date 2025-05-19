import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: 'AIzaSyAGxugbJDi84dIQeIvx6moBPdCDwJdhJIw'
    })
  ],
  model: 'googleai/gemini-2.0-flash',
});
