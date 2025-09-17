'use server';

/**
 * @fileOverview An AI agent to assist songwriters by generating a verse for a song.
 *
 * - generateSongVerse - A function that generates a song verse.
 * - GenerateSongVerseInput - The input type for the generateSongVerse function.
 * - GenerateSongVerseOutput - The return type for the generateSongVerse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSongVerseInputSchema = z.object({
  theme: z
    .string()
    .describe("The theme or mood of the song. e.g., 'heartbreak', 'summer nights', 'rebellion'"),
  chorus: z
    .string()
    .describe('The lyrics of the song\'s chorus.'),
  keywords: z
    .string()
    .optional()
    .describe('Optional keywords or concepts to include in the verse.'),
});
export type GenerateSongVerseInput = z.infer<typeof GenerateSongVerseInputSchema>;

const GenerateSongVerseOutputSchema = z.object({
  verse: z.string().describe('The generated song verse.'),
});
export type GenerateSongVerseOutput = z.infer<typeof GenerateSongVerseOutputSchema>;

export async function generateSongVerse(input: GenerateSongVerseInput): Promise<GenerateSongVerseOutput> {
  return generateSongVerseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSongVersePrompt',
  input: {schema: GenerateSongVerseInputSchema},
  output: {schema: GenerateSongVerseOutputSchema},
  prompt: `You are an expert songwriter and creative co-writer. Your task is to write a compelling verse for a song based on the provided theme, chorus, and keywords. The verse should match the tone and style of the chorus and seamlessly lead into it.

Theme: {{{theme}}}

Chorus:
{{{chorus}}}

{{#if keywords}}
Keywords to include: {{{keywords}}}
{{/if}}

Based on the information above, please generate one verse for the song.
`,
});

const generateSongVerseFlow = ai.defineFlow(
  {
    name: 'generateSongVerseFlow',
    inputSchema: GenerateSongVerseInputSchema,
    outputSchema: GenerateSongVerseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
