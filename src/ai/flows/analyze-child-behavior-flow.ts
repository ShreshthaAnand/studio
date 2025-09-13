'use server';
/**
 * @fileOverview This file defines a Genkit flow that analyzes a child's behavior based on a parent's description of a video.
 *
 * - analyzeChildBehavior - A function that accepts a description of a video and returns an analysis of the child's behavior.
 * - AnalyzeChildBehaviorInput - The input type for the analyzeChildBehavior function.
 * - AnalyzeChildBehaviorOutput - The return type for the analyzeChildBehavior function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeChildBehaviorInputSchema = z.object({
  description: z.string().describe("A parent's description of a video showing their child's actions."),
});

export type AnalyzeChildBehaviorInput = z.infer<typeof AnalyzeChildBehaviorInputSchema>;

const AnalyzeChildBehaviorOutputSchema = z.object({
  analysis: z.string().describe("An analysis of the child's behavior, explaining what they are doing and what it might mean."),
});

export type AnalyzeChildBehaviorOutput = z.infer<typeof AnalyzeChildBehaviorOutputSchema>;

export async function analyzeChildBehavior(
  input: AnalyzeChildBehaviorInput
): Promise<AnalyzeChildBehaviorOutput> {
  return analyzeChildBehaviorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeChildBehaviorPrompt',
  input: { schema: AnalyzeChildBehaviorInputSchema },
  output: { schema: AnalyzeChildBehaviorOutputSchema },
  prompt: `You are an expert in child psychology and behavior analysis. A parent will provide a description of a video of their child. Your task is to analyze the child's actions and provide a clear, objective summary of what the child is doing and potential reasons for their behavior.

Focus on observable actions and provide a neutral, helpful analysis.

Parent's Description of Video:
{{{description}}}
`,
});

const analyzeChildBehaviorFlow = ai.defineFlow(
  {
    name: 'analyzeChildBehaviorFlow',
    inputSchema: AnalyzeChildBehaviorInputSchema,
    outputSchema: AnalyzeChildBehaviorOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return {
      analysis: output!.analysis,
    };
  }
);
