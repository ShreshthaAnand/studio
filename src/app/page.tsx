'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import SelectedImagesBar from '@/components/selected-images-bar';
import SentenceControls from '@/components/sentence-controls';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { ImageUploader } from '@/components/image-uploader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import ParentInsight from '@/components/parent-insight';

const NUM_UPLOAD_SLOTS = 12;

export default function Home() {
  const [selectedImages, setSelectedImages] = useState<ImagePlaceholder[]>([]);
  const [customImages, setCustomImages] = useState<(ImagePlaceholder | null)[]>([]);

  useEffect(() => {
    try {
      const storedImages = localStorage.getItem('customImages');
      if (storedImages) {
        const parsedImages = JSON.parse(storedImages);
        const images = new Array(NUM_UPLOAD_SLOTS).fill(null);
        parsedImages.slice(0, NUM_UPLOAD_SLOTS).forEach((img: ImagePlaceholder | null, i: number) => {
          if (img) images[i] = img;
        });
        setCustomImages(images);
      } else {
        setCustomImages(new Array(NUM_UPLOAD_SLOTS).fill(null));
      }
    } catch (error) {
      console.error("Failed to load images from localStorage", error);
      setCustomImages(new Array(NUM_UPLOAD_SLOTS).fill(null));
    }
  }, []);

  const updateCustomImages = (newImages: (ImagePlaceholder | null)[]) => {
    setCustomImages(newImages);
    try {
      localStorage.setItem('customImages', JSON.stringify(newImages));
    } catch (error) {
        console.error("Failed to save images to localStorage", error);
    }
  };


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

  const handleImageUpload = (index: number, image: ImagePlaceholder) => {
    const newImages = [...customImages];
    newImages[index] = image;
    updateCustomImages(newImages);
    handleSelectImage(image);
  };
  
  const handleImageRemove = (index: number) => {
    const newImages = [...customImages];
    const removedImage = newImages[index];
    if (removedImage) {
        handleDeselectImage(removedImage);
    }
    newImages[index] = null;
    updateCustomImages(newImages);
  };

  const handleClearAllCustomImages = () => {
    updateCustomImages(new Array(NUM_UPLOAD_SLOTS).fill(null));
    // Also clear them from the selection bar if they are present
    const customImageIds = customImages.filter(img => img !== null).map(img => img!.id);
    setSelectedImages(prev => prev.filter(img => !customImageIds.includes(img.id)));
  }


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
             <CardHeader className="flex-row items-center justify-between">
                <div>
                    <CardTitle>Add Your Images</CardTitle>
                    <CardDescription>Click on a card below to upload an image from your device. It will be saved for future use.</CardDescription>
                </div>
                <Button variant="destructive" onClick={handleClearAllCustomImages} disabled={!customImages.some(img => img)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear All Uploads
                </Button>
             </CardHeader>
             <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {customImages.map((image, index) => (
                    <ImageUploader 
                        key={index} 
                        initialImage={image}
                        onUpload={(img) => handleImageUpload(index, img)} 
                        onRemove={() => handleImageRemove(index)}
                        onImageClick={handleSelectImage}
                    />
                  ))}
              </div>
            </CardContent>
          </Card>
          
          <ParentInsight />
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground">
        <p>Built with Next.js and Firebase Genkit. Select images to form a sentence.</p>
      </footer>
    </div>
  );
}
