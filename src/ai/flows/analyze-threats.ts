'use server';

/**
 * @fileOverview An AI agent for analyzing network traffic and identifying potential security threats.
 *
 * - analyzeNetworkThreats - A function that analyzes network traffic for threats.
 * - AnalyzeNetworkThreatsInput - The input type for the analyzeNetworkThreats function.
 * - AnalyzeNetworkThreatsOutput - The return type for the analyzeNetworkThreats function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {scanNetwork} from '@/services/network-scanner';

const AnalyzeNetworkThreatsInputSchema = z.object({
  networkData: z
    .string()
    .describe('A JSON string containing data about the network to analyze.'),
});
export type AnalyzeNetworkThreatsInput = z.infer<typeof AnalyzeNetworkThreatsInputSchema>;

const AnalyzeNetworkThreatsOutputSchema = z.object({
  threats: z
    .array(z.string())
    .describe('A list of potential security threats identified in the network data.'),
  anomalies: z
    .array(z.string())
    .describe('A list of anomalies detected in the network data.'),
  summary: z.string().describe('A summary of the network analysis results.'),
});
export type AnalyzeNetworkThreatsOutput = z.infer<typeof AnalyzeNetworkThreatsOutputSchema>;

export async function analyzeNetworkThreats(input: AnalyzeNetworkThreatsInput): Promise<
  AnalyzeNetworkThreatsOutput
> {
  return analyzeNetworkThreatsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeNetworkThreatsPrompt',
  input: {
    schema: z.object({
      networkData: z
        .string()
        .describe('A JSON string containing data about the network to analyze.'),
    }),
  },
  output: {
    schema: z.object({
      threats: z
        .array(z.string())
        .describe('A list of potential security threats identified in the network data.'),
      anomalies: z
        .array(z.string())
        .describe('A list of anomalies detected in the network data.'),
      summary: z.string().describe('A summary of the network analysis results.'),
    }),
  },
  prompt: `You are an AI security expert analyzing network data for threats and anomalies.

Analyze the following network data and identify any potential security threats and anomalies.

Network Data:
{{networkData}}

Provide a summary of your analysis.
`, // Ensure networkData is correctly formatted in the prompt
});

const analyzeNetworkThreatsFlow = ai.defineFlow<
  typeof AnalyzeNetworkThreatsInputSchema,
  typeof AnalyzeNetworkThreatsOutputSchema
>({
  name: 'analyzeNetworkThreatsFlow',
  inputSchema: AnalyzeNetworkThreatsInputSchema,
  outputSchema: AnalyzeNetworkThreatsOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
});
