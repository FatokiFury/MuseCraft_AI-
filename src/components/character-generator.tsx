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
import { generateCharacterProfile, GenerateCharacterProfileOutput } from '@/ai/flows/generate-character-profile';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Sparkles, Milestone, BookOpen } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

const formSchema = z.object({
  characterName: z.string().min(1, 'Character name is required.'),
  coreTraits: z.string().min(1, 'Core traits are required.'),
  storyContext: z.string().optional(),
});

export function CharacterGenerator() {
  const [isGeneratingProfile, setIsGeneratingProfile] = useState(false);
  const [generatedProfile, setGeneratedProfile] = useState<GenerateCharacterProfileOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      characterName: '',
      coreTraits: '',
      storyContext: '',
    },
  });

  async function onProfileSubmit(values: z.infer<typeof formSchema>) {
    setIsGeneratingProfile(true);
    setGeneratedProfile(null);
    try {
      const result = await generateCharacterProfile(values);
      if (result) {
        setGeneratedProfile(result);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to generate character profile. Please try again.",
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
      setIsGeneratingProfile(false);
    }
  }


  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Character Generator</CardTitle>
          <CardDescription>
            Bring your characters to life. Provide a few details to generate a complete profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onProfileSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="characterName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Character Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'Anya Petrova'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="coreTraits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Core Traits</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'rebellious, cynical, sharp-witted'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="storyContext"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Story Context (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the world or situation the character is in..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isGeneratingProfile}>
                {isGeneratingProfile ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Profile'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline">Generated Profile</CardTitle>
          <CardDescription>
            Your AI-generated character profile will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          {isGeneratingProfile ? (
            <div className="flex flex-1 items-center justify-center rounded-md border border-dashed">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : generatedProfile ? (
            <div className="space-y-4">
              <Accordion type="single" collapsible defaultValue="name" className="w-full">
                <AccordionItem value="name">
                  <AccordionTrigger>
                      <div className="flex items-center gap-2">
                          <User className="h-5 w-5" /> Full Name
                      </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-2xl font-bold">{generatedProfile.fullName}</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="personality">
                  <AccordionTrigger>
                      <div className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5" /> Personality Traits
                      </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                      {generatedProfile.personalityTraits.map((trait, index) => (
                        <li key={index}>{trait}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="backstory">
                  <AccordionTrigger>
                      <div className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5" /> Backstory
                      </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">{generatedProfile.backstory}</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="motivations">
                  <AccordionTrigger>
                      <div className="flex items-center gap-2">
                          <Milestone className="h-5 w-5" /> Motivations & Arc
                      </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Motivations</h4>
                      <p className="text-muted-foreground whitespace-pre-wrap">{generatedProfile.motivations}</p>
                    </div>
                     <div>
                      <h4 className="font-semibold mb-2">Potential Character Arc</h4>
                      <p className="text-muted-foreground whitespace-pre-wrap">{generatedProfile.characterArc}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center rounded-md border border-dashed text-center text-muted-foreground">
              <p>Fill out the form to generate a character profile.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
