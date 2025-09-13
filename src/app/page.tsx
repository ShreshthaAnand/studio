'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import SelectedImagesBar from '@/components/selected-images-bar';
import SentenceControls from '@/components/sentence-controls';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { ImageUploader } from '@/components/image-uploader';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function Home() {
  const [selectedImages, setSelectedImages] = useState<ImagePlaceholder[]>([]);

  const handleSelectImage = (image: ImagePlaceholder) => {
    setSelectedImages((prev) => [...prev, image]);
  };

  const handleDeselectImage = (image: ImagePlaceholder) => {
    setSelectedImages((prev) => {
      const index = prev.findLastIndex(img => img.id === image.id);
      if (index > -1) {
        const newSelection = [...prev];
        newSelection.splice(index, 1);
        return newSelection;
      }
      return prev;
    });
  };

  const handleClearSelection = () => {
    setSelectedImages([]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 flex flex-col container mx-auto p-4 md:p-8">
        <div className="flex flex-col gap-6 md:gap-8">
          <SelectedImagesBar
            selectedImages={selectedImages}
            onDeselect={handleDeselectImage}
            onClear={handleClearSelection}
          />
          
          <SentenceControls 
            selectedImages={selectedImages}
            onGenerationComplete={handleClearSelection}
          />
          
          <Card className="bg-white/80 shadow-lg border-2 border-primary/20">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 flex items-center justify-center">
                    <div className="w-full max-w-[200px]">
                        <ImageUploader onUpload={handleSelectImage} />
                    </div>
                </div>
                <div className="md:col-span-2 text-center md:text-left flex flex-col justify-center">
                    <h2 className="text-2xl font-bold text-primary-dark mb-2">Build a Sentence!</h2>
                    <p className="text-muted-foreground">
                        Upload your own pictures to create a story. Click on the cloud to add an image from your device.
                    </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground">
        <p>Built with Next.js and Firebase Genkit. Upload your own images to form a sentence.</p>
      </footer>
    </div>
  );
}
