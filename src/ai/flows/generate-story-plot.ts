'use server';

/**
 * @fileOverview An AI agent to generate story plot outlines from a premise.
 *
 * - generateStoryPlot - A function that handles the story plot generation process.
 * - GenerateStoryPlotInput - The input type for the generateStoryPlot function.
 * - GenerateStoryPlotOutput - The return type for the generateStoryPlot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStoryPlotInputSchema = z.object({
  premise: z.string().describe('A brief premise or idea for a story.'),
});
export type GenerateStoryPlotInput = z.infer<typeof GenerateStoryPlotInputSchema>;

const PlotOutlineSchema = z.object({
    title: z.string().describe("The title of the story plot."),
    logline: z.string().describe("A one-sentence summary of the plot."),
    plot: z.string().describe("The detailed plot outline, formatted with sections for Setup, Confrontation, and Resolution."),
});

const GenerateStoryPlotOutputSchema = z.object({
  outlines: z.array(PlotOutlineSchema).describe('An array of three distinct plot outlines.'),
});
export type GenerateStoryPlotOutput = z.infer<typeof GenerateStoryPlotOutputSchema>;

export async function generateStoryPlot(input: GenerateStoryPlotInput): Promise<GenerateStoryPlotOutput> {
  return generateStoryPlotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStoryPlotPrompt',
  input: {schema: GenerateStoryPlotInputSchema},
  output: {schema: GenerateStoryPlotOutputSchema},
  prompt: `You are a master storyteller and plot developer. Your task is to take a user's story premise and generate three distinct and compelling plot outlines.

For each outline, provide a catchy title, a one-sentence logline, and a detailed plot breakdown using the classic three-act structure (Setup, Confrontation, Resolution).

Story Premise: {{{premise}}}

Generate three unique plot outlines based on this premise. Ensure the output is in the correct format.`,
});

const generateStoryPlotFlow = ai.defineFlow(
  {
    name: 'generateStoryPlotFlow',
    inputSchema: GenerateStoryPlotInputSchema,
    outputSchema: GenerateStoryPlotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
