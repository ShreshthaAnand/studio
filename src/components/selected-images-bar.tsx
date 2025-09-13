'use client';

import Image from 'next/image';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface SelectedImagesBarProps {
  selectedImages: ImagePlaceholder[];
  onDeselect: (image: ImagePlaceholder) => void;
  onClear: () => void;
}

export default function SelectedImagesBar({
  selectedImages,
  onDeselect,
  onClear,
}: SelectedImagesBarProps) {
  const hasImages = selectedImages.length > 0;

  return (
    <Card className={cn(
        "w-full p-4 transition-all duration-300 min-h-[120px] shadow-sm",
        !hasImages && "flex items-center justify-center bg-accent/30"
      )}>
      {hasImages ? (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Your Sequence</h2>
            <Button variant="ghost" size="sm" onClick={onClear}>
              <X className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-3">
            {selectedImages.map((image, index) => (
              <div key={`${image.id}-${index}`} className="relative group">
                <Badge
                  variant="outline"
                  className="flex items-center gap-2 p-2 pl-3 pr-8 rounded-lg text-base border-primary/50 bg-primary/10"
                >
                  <Image
                    src={image.imageUrl}
                    alt={image.description}
                    width={24}
                    height={24}
                    className="rounded-sm object-cover"
                    data-ai-hint={image.imageHint}
                  />
                  <span className="font-medium">{image.description}</span>
                </Badge>
                <button
                  onClick={() => onDeselect(image)}
                  aria-label={`Remove ${image.description}`}
                  className="absolute -top-1.5 -right-1.5 bg-secondary text-secondary-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:ring-2 focus:ring-ring"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground text-center">
          Select images below to start building your sentence.
        </p>
      )}
    </Card>
  );
}
