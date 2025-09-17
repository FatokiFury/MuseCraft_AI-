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
import { generatePoemStanza, GeneratePoemStanzaInput } from '@/ai/flows/generate-poem-stanza';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  theme: z.string().min(1, 'Theme is required.'),
  existingPoem: z.string().optional(),
});

export function PoetryMuse() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedStanza, setGeneratedStanza] = useState('');
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      theme: '',
      existingPoem: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedStanza('');
    try {
      const result = await generatePoemStanza(values as GeneratePoemStanzaInput);
      if (result.stanza) {
        setGeneratedStanza(result.stanza);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to generate stanza. Please try again.",
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
          <CardTitle className="font-headline">Co-Writing Muse</CardTitle>
          <CardDescription>
            Provide a theme and an optional existing poem to generate a new stanza.
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
                    <FormLabel>Theme or Concept</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'a walk in the woods'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="existingPoem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Existing Poem (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste your existing poem here..."
                        className="min-h-[150px]"
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
                    Generating...
                  </>
                ) : (
                  'Generate Stanza'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline">Generated Stanza</CardTitle>
          <CardDescription>
            Your AI-generated stanza will appear here. You can edit it directly.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex">
          {isLoading ? (
            <div className="flex flex-1 items-center justify-center rounded-md border border-dashed">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Textarea
              value={generatedStanza}
              onChange={(e) => setGeneratedStanza(e.target.value)}
              placeholder="Your new stanza will be here..."
              className="min-h-[250px] flex-1 text-base"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
