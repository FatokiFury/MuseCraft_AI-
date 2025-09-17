
'use server';

/**
 * @fileOverview An AI agent to generate concept art for a character.
 *
 * - generateConceptArt - A function that generates concept art from a character profile.
 * - GenerateConceptArtInput - The input type for the generateConceptArt function.
 * - GenerateConceptArtOutput - The return type for the generateConceptArt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateConceptArtInputSchema = z.object({
    fullName: z.string().describe("The character's full name."),
    personalityTraits: z.array(z.string()).describe("A list of key personality traits."),
    backstory: z.string().describe("A summary of the character's backstory."),
    motivations: z.string().describe("The character's primary motivations."),
    characterArc: z.string().describe("A potential character arc for the story."),
    coreTraits: z.string().describe("The character's core traits"),
    storyContext: z.string().optional().describe("The context of the story."),
});
export type GenerateConceptArtInput = z.infer<typeof GenerateConceptArtInputSchema>;

const GenerateConceptArtOutputSchema = z.object({
  imageDataUri: z.string().describe('The generated image as a data URI.'),
});
export type GenerateConceptArtOutput = z.infer<typeof GenerateConceptArtOutputSchema>;


export async function generateConceptArt(input: GenerateConceptArtInput): Promise<GenerateConceptArtOutput> {
  return generateConceptArtFlow(input);
}

const generateConceptArtFlow = ai.defineFlow(
  {
    name: 'generateConceptArtFlow',
    inputSchema: GenerateConceptArtInputSchema,
    outputSchema: GenerateConceptArtOutputSchema,
  },
  async (input) => {
    const prompt = `Generate a piece of concept art for a character.

    Character Details:
    - Name: ${input.fullName}
    - Core Traits: ${input.coreTraits}
    - Personality: ${input.personalityTraits.join(', ')}
    - Backstory: ${input.backstory}
    - Motivations: ${input.motivations}
    - Story Context: ${input.storyContext || 'N/A'}

    Style: digital painting, detailed, character concept art, fantasy.
    `;

    const {output} = await ai.generate({
      model: 'googleai/gemini-1.5-flash-latest',
      prompt: `Generate an image based on the following description: ${prompt}`,
    });

    if (!output) {
      throw new Error('Image generation failed to produce a result.');
    }
    
    const imagePart = output.media;

    if (!imagePart?.url) {
      throw new Error('Image generation failed to produce a result.');
    }

    return { imageDataUri: imagePart.url };
  }
);
