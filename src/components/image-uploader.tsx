'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { UploadCloud, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface ImageUploaderProps {
  onUpload: (image: ImagePlaceholder) => void;
  onDeselect?: (image: ImagePlaceholder) => void;
}

export function ImageUploader({ onUpload, onDeselect }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<ImagePlaceholder | null>(null);
  const { toast } = useToast();

  const handleCardClick = () => {
    if (!uploadedImage) {
      inputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please select an image file.',
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const newImage: ImagePlaceholder = {
          id: `uploaded-${Date.now()}`,
          description: file.name.split('.')[0] || 'Uploaded Image',
          imageUrl: dataUrl,
          imageHint: 'custom image',
        };
        setUploadedImage(newImage);
        onUpload(newImage);
      };
      reader.readAsDataURL(file);
    }
    // Reset the input value to allow uploading the same file again
    if(inputRef.current) {
      inputRef.current.value = '';
    }
  };
  
  const handleReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if(uploadedImage && onDeselect) {
        onDeselect(uploadedImage)
    }
    setUploadedImage(null);
    if(inputRef.current) {
      inputRef.current.value = '';
    }
  }

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      <Card
        onClick={handleCardClick}
        className={cn(
          'transition-all duration-300 overflow-hidden group relative',
          !uploadedImage && 'cursor-pointer hover:shadow-xl hover:-translate-y-1 focus-within:ring-4 focus-within:ring-primary/50 focus-within:ring-offset-2',
          !uploadedImage && 'flex flex-col items-center justify-center bg-accent/50 hover:bg-accent/80 aspect-square border-2 border-dashed border-primary/40',
          uploadedImage && 'shadow-md'
        )}
        tabIndex={uploadedImage ? -1 : 0}
        onKeyDown={(e) => {
            if (!uploadedImage && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                handleCardClick();
            }
        }}
        role={uploadedImage ? 'img' : 'button'}
        aria-label={uploadedImage ? uploadedImage.description : "Upload an image"}
      >
        {uploadedImage ? (
          <>
            <Image
                src={uploadedImage.imageUrl}
                alt={uploadedImage.description}
                fill
                className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <Button variant="destructive" size="icon" onClick={handleReset}>
                    <X className="h-5 w-5"/>
                    <span className="sr-only">Remove Image</span>
                 </Button>
            </div>
          </>
        ) : (
            <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-3">
                <UploadCloud className="h-12 w-12 text-primary" />
                <p className="font-bold text-base text-primary/90">Upload Image</p>
            </CardContent>
        )}
      </Card>
    </>
  );
}
