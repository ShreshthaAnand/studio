'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Microscope } from 'lucide-react';
import { analyzeBehaviorAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';
import { Input } from './ui/input';

export default function BehaviorAnalysis() {
  const [description, setDescription] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        const url = URL.createObjectURL(file);
        setVideoUrl(url);
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please select a video file.',
        });
        setVideoUrl(null);
        event.target.value = '';
      }
    } else {
        setVideoUrl(null);
    }
  };

  const handleAnalyzeAction = async () => {
    if (!description.trim()) {
      toast({
        variant: 'destructive',
        title: 'Empty Description',
        description: 'Please describe the video of your child\'s actions.',
      });
      return;
    }

    setIsLoading(true);
    setAnalysis('');

    const result = await analyzeBehaviorAction(description);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: result.error,
      });
    } else {
      setAnalysis(result.analysis);
    }
    setIsLoading(false);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Behavior Analysis</CardTitle>
        <CardDescription>
          Upload a video clip and describe the child's actions. Our AI will analyze the behavior and provide an objective summary.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
            <label htmlFor="video-upload" className="font-medium text-sm">Upload Video</label>
            <Input id="video-upload" type="file" accept="video/*" onChange={handleFileChange} />
        </div>
        
        {videoUrl && (
            <div className="rounded-xl overflow-hidden border">
                <video src={videoUrl} controls className="w-full aspect-video" />
            </div>
        )}

        <Textarea
          placeholder="e.g., 'In the video, the child is stacking blocks and then knocking them over repeatedly...'"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          disabled={isLoading}
          aria-label="Description of video"
        />
        <Button onClick={handleAnalyzeAction} disabled={isLoading} size="lg">
          {isLoading ? (
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          ) : (
            <Microscope className="mr-2 h-6 w-6" />
          )}
          Analyze Behavior
        </Button>
        <div className="flex-1 w-full p-4 min-h-[60px] bg-muted/70 rounded-xl flex items-center justify-center text-center border-2 border-dashed">
          {isLoading ? (
            <Skeleton className="h-7 w-3/4" />
          ) : analysis ? (
            <p className="text-lg font-medium text-foreground">{analysis}</p>
          ) : (
            <p className="text-muted-foreground font-medium">The AI's analysis will appear here.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
