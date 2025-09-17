'use server';

/**
 * @fileOverview Character profile generation AI agent.
 *
 * - generateCharacterProfile - A function that handles the character profile generation process.
 * - GenerateCharacterProfileInput - The input type for the generateCharacterProfile function.
 * - GenerateCharacterProfileOutput - The return type for the generateCharacterProfile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCharacterProfileInputSchema = z.object({
  characterName: z.string().describe("The name of the character."),
  coreTraits: z.string().describe("A few core traits of the character (e.g., 'brave knight', 'shy scientist')."),
  storyContext: z.string().optional().describe("The context of the story the character is in."),
});
export type GenerateCharacterProfileInput = z.infer<typeof GenerateCharacterProfileInputSchema>;

const GenerateCharacterProfileOutputSchema = z.object({
    fullName: z.string().describe("The character's full name, if not provided in the input."),
    personalityTraits: z.array(z.string()).describe("A list of key personality traits."),
    backstory: z.string().describe("A summary of the character's backstory."),
    motivations: z.string().describe("The character's primary motivations."),
    characterArc: z.string().describe("A potential character arc for the story."),
});
export type GenerateCharacterProfileOutput = z.infer<typeof GenerateCharacterProfileOutputSchema>;

export async function generateCharacterProfile(input: GenerateCharacterProfileInput): Promise<GenerateCharacterProfileOutput> {
  return generateCharacterProfileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCharacterProfilePrompt',
  input: {schema: GenerateCharacterProfileInputSchema},
  output: {schema: GenerateCharacterProfileOutputSchema},
  prompt: `You are an expert character designer for stories. Based on the provided information, generate a detailed character profile.

Character Name: {{{characterName}}}
Core Traits: {{{coreTraits}}}
{{#if storyContext}}
Story Context:
{{{storyContext}}}
{{/if}}

Flesh out the character with a full name, a list of personality traits, a compelling backstory, clear motivations, and a potential character arc. Make sure to output the response according to the output schema.`,
});

const generateCharacterProfileFlow = ai.defineFlow(
  {
    name: 'generateCharacterProfileFlow',
    inputSchema: GenerateCharacterProfileInputSchema,
    outputSchema: GenerateCharacterProfileOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
