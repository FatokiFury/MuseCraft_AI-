'use server';

/**
 * @fileOverview An AI agent to generate a new stanza for a poem based on a given theme or concept.
 *
 * - generatePoemStanza - A function that generates a poem stanza.
 * - GeneratePoemStanzaInput - The input type for the generatePoemStanza function.
 * - GeneratePoemStanzaOutput - The return type for the generatePoemStanza function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePoemStanzaInputSchema = z.object({
  theme: z
    .string()
    .describe("The theme or concept for the poem stanza.  For example, 'loss' or 'a walk in the woods'."),
  existingPoem: z
    .string()
    .optional()
    .describe('The existing poem, if any.  This helps maintain context and style.'),
});
export type GeneratePoemStanzaInput = z.infer<typeof GeneratePoemStanzaInputSchema>;

const GeneratePoemStanzaOutputSchema = z.object({
  stanza: z.string().describe('The generated poem stanza.'),
});
export type GeneratePoemStanzaOutput = z.infer<typeof GeneratePoemStanzaOutputSchema>;

export async function generatePoemStanza(input: GeneratePoemStanzaInput): Promise<GeneratePoemStanzaOutput> {
  return generatePoemStanzaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePoemStanzaPrompt',
  input: {schema: GeneratePoemStanzaInputSchema},
  output: {schema: GeneratePoemStanzaOutputSchema},
  prompt: `You are a skilled poet, adept at creating evocative and meaningful stanzas.

  Based on the provided theme and, if available, the existing poem, generate a new stanza that fits seamlessly and enhances the overall piece.

  Theme: {{{theme}}}
  {{#if existingPoem}}
  Existing Poem:
  {{{existingPoem}}}
  {{/if}}

  Stanza:
  `, // Ensuring the output is clearly the generated stanza
});

const generatePoemStanzaFlow = ai.defineFlow(
  {
    name: 'generatePoemStanzaFlow',
    inputSchema: GeneratePoemStanzaInputSchema,
    outputSchema: GeneratePoemStanzaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
