'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateStoryPlot, GenerateStoryPlotOutput } from '@/ai/flows/generate-story-plot';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

const formSchema = z.object({
  premise: z.string().min(10, 'Please provide a more detailed premise.'),
});

export function StoryPlotGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPlots, setGeneratedPlots] = useState<GenerateStoryPlotOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      premise: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedPlots(null);
    try {
      const result = await generateStoryPlot(values);
      if (result && result.outlines.length > 0) {
        setGeneratedPlots(result);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to generate story plots. Please try again.",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Story Plot Generator</CardTitle>
          <CardDescription>
            Enter a story premise and get three complete plot outlines.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="premise"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Story Premise</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'A detective in a steampunk city hunts a clockwork killer who leaves behind intricate gears as their only clue.'"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Plots...
                  </>
                ) : (
                  'Generate Plots'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline">Generated Outlines</CardTitle>
          <CardDescription>
            Your AI-generated plot outlines will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          {isLoading ? (
            <div className="flex flex-1 items-center justify-center rounded-md border border-dashed">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : generatedPlots ? (
            <Accordion type="single" collapsible className="w-full space-y-2">
              {generatedPlots.outlines.map((outline, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="font-semibold text-lg hover:no-underline">
                    {outline.title}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <p className="font-medium text-muted-foreground italic">"{outline.logline}"</p>
                    <div className="whitespace-pre-wrap text-muted-foreground">{outline.plot}</div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="flex h-full items-center justify-center rounded-md border border-dashed text-center text-muted-foreground">
              <p>Enter a premise to generate story plots.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
