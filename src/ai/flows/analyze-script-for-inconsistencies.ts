'use server';

/**
 * @fileOverview Script analysis AI agent for identifying inconsistencies.
 *
 * - analyzeScript - A function that handles the script analysis process.
 * - AnalyzeScriptInput - The input type for the analyzeScript function.
 * - AnalyzeScriptOutput - The return type for the analyzeScript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeScriptInputSchema = z.object({
  scriptContent: z
    .string()
    .describe('The content of the script to be analyzed.'),
  scriptName: z.string().describe('The name of the script file.'),
});
export type AnalyzeScriptInput = z.infer<typeof AnalyzeScriptInputSchema>;

const AnalyzeScriptOutputSchema = z.object({
  summary: z.string().describe('A summary of the script analysis.'),
  storyGaps: z.array(z.string()).describe('Identified story gaps in the script.'),
  timelineConflicts: z
    .array(z.string())
    .describe('Identified timeline conflicts in the script.'),
  characterInconsistencies: z
    .array(z.string())
    .describe('Identified character inconsistencies in the script.'),
});
export type AnalyzeScriptOutput = z.infer<typeof AnalyzeScriptOutputSchema>;

export async function analyzeScript(input: AnalyzeScriptInput): Promise<AnalyzeScriptOutput> {
  return analyzeScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeScriptPrompt',
  input: {schema: AnalyzeScriptInputSchema},
  output: {schema: AnalyzeScriptOutputSchema},
  prompt: `You are a script analysis expert. You will analyze the provided script for story gaps, timeline conflicts, and character inconsistencies.

Script Name: {{{scriptName}}}
Script Content:
{{{scriptContent}}}

Provide a summary of your analysis, list any story gaps, timeline conflicts, and character inconsistencies found in the script.

Make sure to output the response according to the output schema, and include a descriptive summary.`,
});

const analyzeScriptFlow = ai.defineFlow(
  {
    name: 'analyzeScriptFlow',
    inputSchema: AnalyzeScriptInputSchema,
    outputSchema: AnalyzeScriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
