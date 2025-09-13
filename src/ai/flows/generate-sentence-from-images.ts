'use server';
/**
 * @fileOverview This file defines a Genkit flow that generates a sentence from a series of selected images.
 *
 * - generateSentenceFromImages - A function that accepts an array of image data URIs and returns a generated sentence.
 * - GenerateSentenceFromImagesInput - The input type for the generateSentenceFromImages function.
 * - GenerateSentenceFromImagesOutput - The return type for the generateSentenceFromImages function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSentenceFromImagesInputSchema = z.object({
  imageDataUris: z
    .array(
      z
        .string()
        .describe(
          "A list of images, as data URIs that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
        )
    )
    .describe('An array of image data URIs representing objects, actions, or feelings.'),
});

export type GenerateSentenceFromImagesInput = z.infer<
  typeof GenerateSentenceFromImagesInputSchema
>;

const GenerateSentenceFromImagesOutputSchema = z.object({
  generatedSentence: z
    .string()
    .describe('A grammatically correct and contextually appropriate sentence generated from the selected images.'),
});

export type GenerateSentenceFromImagesOutput = z.infer<
  typeof GenerateSentenceFromImagesOutputSchema
>;

export async function generateSentenceFromImages(
  input: GenerateSentenceFromImagesInput
): Promise<GenerateSentenceFromImagesOutput> {
  return generateSentenceFromImagesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSentenceFromImagesPrompt',
  input: {schema: GenerateSentenceFromImagesInputSchema},
  output: {schema: GenerateSentenceFromImagesOutputSchema},
  prompt: `You are an AI that helps a child communicate their needs. A child will select one or more images that represent something they want to do. 
  
Your task is to generate a sentence from the child's perspective, starting with "I want to...". The sentence should describe the action or object in the image(s).

For example:
- If the image shows a person sleeping, you should generate "I want to sleep."
- If the images show a person eating and an apple, you should generate "I want to eat an apple."

Images: 
{{#each imageDataUris}}
  {{media url=this}}
{{/each}}
`,
});

const generateSentenceFromImagesFlow = ai.defineFlow(
  {
    name: 'generateSentenceFromImagesFlow',
    inputSchema: GenerateSentenceFromImagesInputSchema,
    outputSchema: GenerateSentenceFromImagesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      generatedSentence: output!.generatedSentence,
    };
  }
);
