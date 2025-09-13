'use client';

import { useEffect, useState, useMemo } from 'react';
import { Languages, Loader2, Sparkles, Volume2 } from 'lucide-react';

import { generateSentenceAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

interface SentenceControlsProps {
  selectedImages: ImagePlaceholder[];
  onGenerationComplete: () => void;
}

export default function SentenceControls({
  selectedImages,
  onGenerationComplete,
}: SentenceControlsProps) {
  const [generatedSentence, setGeneratedSentence] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const handleGenerateSentence = async () => {
    if (selectedImages.length === 0) return;

    setIsLoading(true);
    setGeneratedSentence('');

    const result = await generateSentenceAction(selectedImages);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: result.error,
      });
    } else {
      setGeneratedSentence(result.sentence);
      onGenerationComplete();
    }
    setIsLoading(false);
  };

  const handleSpeak = () => {
    if (!generatedSentence || typeof window === 'undefined') return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(generatedSentence);
    const selectedVoice = voices.find((voice) => voice.lang === language);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    } else {
      utterance.lang = language;
    }
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };
  
  const uniqueLanguages = useMemo(() => {
    if (voices.length > 0) {
        return [...new Map(voices.map(item => [item['lang'], item])).values()];
    }
    return [];
  }, [voices]);


  return (
    <Card className="shadow-lg">
      <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
        <Button
          onClick={handleGenerateSentence}
          disabled={selectedImages.length === 0 || isLoading}
          size="lg"
          className="w-full md:w-auto shrink-0 !text-lg !font-extrabold !px-8 !py-6 rounded-xl"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-6 w-6" />
          )}
          Generate!
        </Button>

        <div className="flex-1 w-full p-4 min-h-[60px] bg-muted/70 rounded-xl flex items-center justify-center text-center border-2 border-dashed">
          {isLoading ? (
            <Skeleton className="h-7 w-3/4" />
          ) : generatedSentence ? (
            <p className="text-xl font-bold text-foreground">{generatedSentence}</p>
          ) : (
            <p className="text-muted-foreground font-medium">Your new sentence will appear here!</p>
          )}
        </div>

        <div className="flex gap-2 w-full md:w-auto shrink-0">
            <Select onValueChange={setLanguage} value={language} disabled={voices.length === 0}>
                <SelectTrigger className="w-full md:w-[150px] !h-12 rounded-xl" aria-label="Select Language">
                    <Languages className="mr-2 h-5 w-5" />
                    <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                    {uniqueLanguages.length > 0 ? uniqueLanguages.map((voice) => (
                        <SelectItem key={voice.name} value={voice.lang}>
                            {voice.lang}
                        </SelectItem>
                    )) : <SelectItem value="loading" disabled>Loading...</SelectItem>}
                </SelectContent>
            </Select>
            <Button
              onClick={handleSpeak}
              disabled={!generatedSentence || isLoading}
              size="lg"
              variant="outline"
              aria-label="Read sentence aloud"
              className="px-3 !h-12 rounded-xl"
            >
              <Volume2 className="h-6 w-6" />
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
