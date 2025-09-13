'use client';

import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ImageGridProps {
  images: ImagePlaceholder[];
  onSelect: (image: ImagePlaceholder) => void;
}

export default function ImageGrid({ images, onSelect }: ImageGridProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Choose an Image</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {images.map((image) => (
            <Card
              key={image.id}
              onClick={() => onSelect(image)}
              className={cn(
                'cursor-pointer transition-all duration-200 overflow-hidden group',
                'hover:shadow-lg hover:-translate-y-1 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2'
              )}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect(image);
                }
              }}
              role="button"
              aria-label={`Select ${image.description}`}
            >
              <CardContent className="p-0 aspect-square">
                <Image
                  src={image.imageUrl}
                  alt={image.description}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint={image.imageHint}
                />
              </CardContent>
              <CardFooter className="p-2 justify-center bg-card">
                <p className="font-medium text-sm text-center truncate">{image.description}</p>
              </CardFooter>
            </Card>
        ))}
      </div>
    </div>
  );
}
