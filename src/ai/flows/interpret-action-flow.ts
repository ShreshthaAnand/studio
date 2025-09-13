'use server';
/**
 * @fileOverview This file defines a Genkit flow that interprets a child's actions based on a parent's description.
 *
 * - interpretAction - A function that accepts a description of a child's actions and returns an interpretation.
 * - InterpretActionInput - The input type for the interpretAction function.
 * - InterpretActionOutput - The return type for the interpretAction function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const InterpretActionInputSchema = z.object({
  description: z.string().describe("A parent's description of their child's actions, gestures, or sounds."),
});

export type InterpretActionInput = z.infer<typeof InterpretActionInputSchema>;

const InterpretActionOutputSchema = z.object({
  interpretation: z.string().describe("An interpretation of what the child might be trying to communicate, framed as 'The child may want to...' or similar."),
});

export type InterpretActionOutput = z.infer<typeof InterpretActionOutputSchema>;

export async function interpretAction(
  input: InterpretActionInput
): Promise<InterpretActionOutput> {
  return interpretActionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interpretActionPrompt',
  input: { schema: InterpretActionInputSchema },
  output: { schema: InterpretActionOutputSchema },
  prompt: `You are an expert in child development and non-verbal communication. A parent will provide a description of their child's actions, and your task is to interpret what the child might be trying to express.

Based on the description, provide a helpful and empathetic interpretation. Frame your response in a way that is easy for a parent to understand. Start your interpretation with phrases like "It sounds like they might be feeling..." or "They could be trying to tell you that...".

Parent's Description:
{{{description}}}
`,
});

const interpretActionFlow = ai.defineFlow(
  {
    name: 'interpretActionFlow',
    inputSchema: InterpretActionInputSchema,
    outputSchema: InterpretActionOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return {
      interpretation: output!.interpretation,
    };
  }
);
