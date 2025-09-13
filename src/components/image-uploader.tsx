'use client';

import { useRef } from 'react';
import { UploadCloud } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onUpload: (image: ImagePlaceholder) => void;
}

export function ImageUploader({ onUpload }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleCardClick = () => {
    inputRef.current?.click();
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
        const uploadedImage: ImagePlaceholder = {
          id: `uploaded-${Date.now()}`,
          description: file.name.split('.')[0] || 'Uploaded Image',
          imageUrl: dataUrl,
          imageHint: 'custom image',
        };
        onUpload(uploadedImage);
      };
      reader.readAsDataURL(file);
    }
  };

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
          'cursor-pointer transition-all duration-200 overflow-hidden group',
          'hover:shadow-lg hover:-translate-y-1 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2',
          'flex flex-col items-center justify-center bg-accent/30 hover:bg-accent/50'
        )}
        tabIndex={0}
        onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCardClick();
            }
        }}
        role="button"
        aria-label="Upload an image"
      >
        <CardContent className="p-2 flex flex-col items-center justify-center text-center gap-2">
            <UploadCloud className="h-8 w-8 text-muted-foreground" />
            <p className="font-medium text-sm text-muted-foreground">Upload Image</p>
        </CardContent>
      </Card>
    </>
  );
}
