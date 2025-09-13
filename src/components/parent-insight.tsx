'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Loader2 } from 'lucide-react';
import { interpretActionAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';

export default function ParentInsight() {
  const [description, setDescription] = useState('');
  const [interpretation, setInterpretation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInterpretAction = async () => {
    if (!description.trim()) {
      toast({
        variant: 'destructive',
        title: 'Empty Description',
        description: 'Please describe your child\'s actions.',
      });
      return;
    }

    setIsLoading(true);
    setInterpretation('');

    const result = await interpretActionAction(description);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Interpretation Failed',
        description: result.error,
      });
    } else {
      setInterpretation(result.interpretation);
    }
    setIsLoading(false);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Parent's Insight</CardTitle>
        <CardDescription>
          Describe your child's recent actions, gestures, or sounds, and let our AI provide insight into what they might be trying to communicate.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Textarea
          placeholder="e.g., 'My child is pointing at the kitchen and making humming sounds...'"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          disabled={isLoading}
        />
        <Button onClick={handleInterpretAction} disabled={isLoading} size="lg">
          {isLoading ? (
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          ) : (
            <BrainCircuit className="mr-2 h-6 w-6" />
          )}
          Interpret Actions
        </Button>
        <div className="flex-1 w-full p-4 min-h-[60px] bg-muted/70 rounded-xl flex items-center justify-center text-center border-2 border-dashed">
          {isLoading ? (
            <Skeleton className="h-7 w-3/4" />
          ) : interpretation ? (
            <p className="text-lg font-medium text-foreground">{interpretation}</p>
          ) : (
            <p className="text-muted-foreground font-medium">The AI's interpretation will appear here.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
