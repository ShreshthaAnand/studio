'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Header } from '@/components/header';
import SelectedImagesBar from '@/components/selected-images-bar';
import SentenceControls from '@/components/sentence-controls';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { ImageUploader } from '@/components/image-uploader';
import { Card, CardContent } from '@/components/ui/card';

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
          
          <Card className="shadow-lg overflow-hidden">
             <CardContent className="p-6 md:p-12 flex items-center justify-center min-h-[450px]">
              <div className="w-full max-w-[300px]">
                  <ImageUploader onUpload={handleSelectImage} />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground">
        <p>Built with Next.js and Firebase Genkit. Select images to form a sentence.</p>
      </footer>
    </div>
  );
}
