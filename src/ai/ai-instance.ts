import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Main AI instance for general text generation tasks
export const ai = genkit({
  promptDir: './prompts', // Assuming prompts might be stored here
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY, // Ensure this environment variable is set
    }),
  ],
  model: 'gemini-1.5-flash-latest', // Updated to a generally available and capable model
});

// Separate AI instance configuration for models with specific capabilities like image generation
// This allows using experimental or specialized models without affecting the default 'ai' instance.
export const experimentalAI = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY,
    }),
  ],
  // It's generally better to specify the model directly in the generate call for experimental models
  // model: 'googleai/gemini-2.0-flash-exp', // Example for image generation, if needed elsewhere
});
