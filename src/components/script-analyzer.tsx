'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { analyzeScript, AnalyzeScriptOutput } from '@/ai/flows/analyze-script-for-inconsistencies';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileCheck2, AlertTriangle, GanttChartSquare, Users } from 'lucide-react';

export function ScriptAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeScriptOutput | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
      setAnalysisResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please select a script file to analyze.',
      });
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const scriptContent = e.target?.result as string;
      if (!scriptContent) {
          toast({ variant: 'destructive', title: 'Error', description: 'Could not read file content.' });
          setIsLoading(false);
          return;
      }
      try {
        const result = await analyzeScript({
          scriptName: file.name,
          scriptContent,
        });
        setAnalysisResult(result);
      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: 'An unexpected error occurred during analysis.',
        });
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to read the file.' });
        setIsLoading(false);
    }
    reader.readAsText(file);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Objective Analysis Tool</CardTitle>
          <CardDescription>
            Upload your script to receive an AI-powered analysis of story gaps, timeline conflicts, and character inconsistencies.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="script-file">Script File</Label>
            <Input id="script-file" type="file" onChange={handleFileChange} accept=".txt,.md,.fountain" />
          </div>
          <Button onClick={handleAnalyze} disabled={isLoading || !file}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Script'
            )}
          </Button>
        </CardContent>
      </Card>
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline">Analysis Results</CardTitle>
          <CardDescription>
            The analysis of your script will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          {isLoading ? (
            <div className="flex h-full items-center justify-center rounded-md border border-dashed">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : analysisResult ? (
            <Accordion type="single" collapsible defaultValue="summary" className="w-full">
              <AccordionItem value="summary">
                <AccordionTrigger>
                    <div className="flex items-center gap-2">
                        <FileCheck2 className="h-5 w-5" /> Summary
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{analysisResult.summary}</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="story-gaps">
                <AccordionTrigger>
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" /> Story Gaps
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                  {analysisResult.storyGaps.length > 0 ? (
                    <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                      {analysisResult.storyGaps.map((gap, index) => (
                        <li key={index}>{gap}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No story gaps found.</p>
                  )}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="timeline-conflicts">
                <AccordionTrigger>
                    <div className="flex items-center gap-2">
                        <GanttChartSquare className="h-5 w-5" /> Timeline Conflicts
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                  {analysisResult.timelineConflicts.length > 0 ? (
                    <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                      {analysisResult.timelineConflicts.map((conflict, index) => (
                        <li key={index}>{conflict}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No timeline conflicts found.</p>
                  )}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="character-inconsistencies">
                <AccordionTrigger>
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5" /> Character Inconsistencies
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                  {analysisResult.characterInconsistencies.length > 0 ? (
                    <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                      {analysisResult.characterInconsistencies.map((inconsistency, index) => (
                        <li key={index}>{inconsistency}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No character inconsistencies found.</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : (
            <div className="flex h-full items-center justify-center rounded-md border border-dashed text-center text-muted-foreground">
              <p>Upload a script and click "Analyze Script" to see the results.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
