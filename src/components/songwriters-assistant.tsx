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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateSongVerse } from '@/ai/flows/generate-song-verse';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  theme: z.string().min(1, 'Theme is required.'),
  chorus: z.string().min(1, 'Chorus is required.'),
  keywords: z.string().optional(),
});

export function SongwritersAssistant() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedVerse, setGeneratedVerse] = useState('');
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      theme: '',
      chorus: '',
      keywords: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedVerse('');
    try {
      const result = await generateSongVerse(values);
      if (result.verse) {
        setGeneratedVerse(result.verse);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to generate verse. Please try again.",
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
          <CardTitle className="font-headline">Songwriter's Assistant</CardTitle>
          <CardDescription>
            Your AI co-writer. Provide a theme and chorus to get a verse for your next hit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Song Theme or Mood</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'A story of summer love'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="chorus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chorus Lyrics</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write the chorus of your song here..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keywords (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'midnight, starlight, highway'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Writing...
                  </>
                ) : (
                  'Write a Verse'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline">Generated Verse</CardTitle>
          <CardDescription>
            Your AI-generated verse will appear here. Edit it and make it your own.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex">
          {isLoading ? (
            <div className="flex flex-1 items-center justify-center rounded-md border border-dashed">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Textarea
              value={generatedVerse}
              onChange={(e) => setGeneratedVerse(e.target.value)}
              placeholder="Your new verse will be here..."
              className="min-h-[250px] flex-1 text-base whitespace-pre-wrap"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
