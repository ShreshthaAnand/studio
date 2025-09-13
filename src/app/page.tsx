'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Header } from '@/components/header';
import SelectedImagesBar from '@/components/selected-images-bar';
import SentenceControls from '@/components/sentence-controls';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ImageUploader } from '@/components/image-uploader';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';

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
             <Tabs defaultValue="default" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-14 p-1">
                <TabsTrigger value="default" className="text-lg font-bold h-full">Default Images</TabsTrigger>
                <TabsTrigger value="custom" className="text-lg font-bold h-full">Add Your Own</TabsTrigger>
              </TabsList>
              <TabsContent value="default">
                <ScrollArea className="h-96 w-full">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4">
                    {PlaceHolderImages.map((image) => (
                      <Card
                        key={image.id}
                        onClick={() => handleSelectImage(image)}
                        className={cn(
                          'cursor-pointer transition-all duration-300 overflow-hidden group',
                          'hover:shadow-xl hover:-translate-y-1 focus-within:ring-4 focus-within:ring-primary/50 focus-within:ring-offset-2 aspect-square'
                        )}
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleSelectImage(image);
                            }
                        }}
                        role="button"
                        aria-label={`Select ${image.description}`}
                      >
                        <CardContent className="p-0 flex flex-col items-center justify-center text-center h-full relative">
                          <Image
                            src={image.imageUrl}
                            alt={image.description}
                            fill
                            className="object-cover"
                            data-ai-hint={image.imageHint}
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <p className="font-bold text-lg text-white z-10 absolute bottom-2 drop-shadow-md">{image.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="custom">
                <div className="p-6 md:p-12 flex items-center justify-center min-h-80">
                  <div className="w-full max-w-[250px]">
                      <ImageUploader onUpload={handleSelectImage} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground">
        <p>Built with Next.js and Firebase Genkit. Select images to form a sentence.</p>
      </footer>
    </div>
  );
}
