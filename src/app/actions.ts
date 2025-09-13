'use server';

import {
  generateSentenceFromImages,
  GenerateSentenceFromImagesInput,
} from '@/ai/flows/generate-sentence-from-images';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

async function imageUrlToDataUrl(imageUrl: string): Promise<string> {
  try {
    const response = await fetch(imageUrl, { cache: 'force-cache' });
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    console.error('Error converting image URL to data URL:', error);
    throw error;
  }
}

export async function generateSentenceAction(
  images: ImagePlaceholder[]
): Promise<{ sentence: string } | { error: string }> {
  if (!images || images.length === 0) {
    return { error: 'No images selected.' };
  }

  try {
    const imageDataUris = await Promise.all(
      images.map(image => imageUrlToDataUrl(image.imageUrl))
    );

    const input: GenerateSentenceFromImagesInput = { imageDataUris };
    const result = await generateSentenceFromImages(input);
    
    return { sentence: result.generatedSentence };
  } catch (error) {
    console.error('An error occurred during sentence generation:', error);
    return { error: 'Failed to generate sentence. Please try again.' };
  }
}
