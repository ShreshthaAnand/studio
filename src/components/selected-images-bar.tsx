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
        "w-full p-4 transition-all duration-300 min-h-[140px] shadow-lg",
        !hasImages && "flex items-center justify-center bg-accent/40 border-2 border-dashed"
      )}>
      {hasImages ? (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Your Story So Far...</h2>
            <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground hover:bg-primary/10 hover:text-primary">
              <X className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-4">
            {selectedImages.map((image, index) => (
              <div key={`${image.id}-${index}`} className="relative group">
                <Badge
                  variant="outline"
                  className="flex items-center gap-3 p-2 pl-3 pr-9 rounded-xl text-lg border-primary/70 bg-primary/10 shadow-sm"
                >
                  <Image
                    src={image.imageUrl}
                    alt={image.description}
                    width={32}
                    height={32}
                    className="rounded-md object-cover"
                    data-ai-hint={image.imageHint}
                  />
                  <span className="font-bold">{image.description}</span>
                </Badge>
                <button
                  onClick={() => onDeselect(image)}
                  aria-label={`Remove ${image.description}`}
                  className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:ring-2 focus:ring-ring"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground text-center font-medium text-lg">
          Add some pictures to start building your sentence!
        </p>
      )}
    </Card>
  );
}
