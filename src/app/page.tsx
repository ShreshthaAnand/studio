'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import SelectedImagesBar from '@/components/selected-images-bar';
import SentenceControls from '@/components/sentence-controls';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { ImageUploader } from '@/components/image-uploader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
            onGenerationComplete={() => {}}
          />
          
          <Card className="shadow-lg overflow-hidden">
             <CardHeader>
                <CardTitle>Add Your Images</CardTitle>
                <CardDescription>Click on a card below to upload an image from your device. It will be added to your story.</CardDescription>
             </CardHeader>
             <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <ImageUploader key={index} onUpload={handleSelectImage} onDeselect={handleDeselectImage} />
                  ))}
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
