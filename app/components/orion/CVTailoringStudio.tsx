import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import logger from '@/lib/logger';
import { CVComponent, OrionOpportunity } from '@/lib/types';

interface CVTailoringStudioProps {
  opportunity: OrionOpportunity;
  cvComponents: CVComponent[];
}

export const CVTailoringStudio: React.FC<CVTailoringStudioProps> = ({ opportunity, cvComponents }) => {
  logger.info('CVTailoringStudio component rendered.', {
    operation: 'render',
    component: 'CVTailoringStudio',
    opportunityId: opportunity.id,
  });

  const [tailoredCVText, setTailoredCVText] = React.useState('');
  const [selectedTab, setSelectedTab] = React.useState('cv-template');

  // Function to simulate generating tailored text (replace with actual LLM call later)
  const generateTailoredText = () => {
    logger.info('Generating tailored CV text.', { opportunityId: opportunity.id });

    // In a real scenario, this would call an LLM via an API route.
    // For now, simulate a response.
    const simulatedResponse = `Tailored CV Content for ${opportunity.title}:\n\nSummary: Leveraging my expertise in [relevant skill from CV] and my experience at [relevant experience from CV], I am uniquely positioned to excel in the ${opportunity.title} role at ${opportunity.company}. My contributions in [specific achievement] align perfectly with the challenges presented in this opportunity.\n\nKey Achievements:\n- Achieved [metric] by [action] at [company], directly impacting [benefit]. (Relevant to ${opportunity.title})\n- Successfully led/managed [project/initiative] resulting in [outcome], demonstrating [skill]. (Relevant to ${opportunity.company} culture)\n\n(Generated using provided CV components and opportunity details.)`;

    setTailoredCVText(simulatedResponse);
    logger.success('Tailored CV text generated successfully.', { opportunityId: opportunity.id });
  };

  return (
    <Card className="bg-gray-800 border-gray-700 p-6">
      <CardHeader className="mb-4">
        <CardTitle className="text-2xl font-bold text-white">CV Tailoring Studio</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-200 mb-3">Opportunity Details</h3>
            <p className="text-gray-400">Company: {opportunity.company}</p>
            <p className="text-gray-400">Title: {opportunity.title}</p>
            <p className="text-gray-400">Description:</p>
            <Textarea
              value={opportunity.description ? opportunity.description : ''}
              readOnly
              rows={10}
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 font-mono"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-200 mb-3">Your CV Components</h3>
            <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar pr-2">
              {cvComponents.length > 0 ? (
                cvComponents.map((component) => (
                  <Card key={component.id} className="bg-gray-700 border-gray-600 p-3 text-sm text-gray-300">
                    <h4 className="font-medium text-white">{component.name}</h4>
                    <p className="text-gray-400 break-words whitespace-pre-wrap">{component.content}</p>
                  </Card>
                ))
              ) : (
                <p className="text-gray-400">No CV components provided. Please fetch or add them.</p>
              )}
            </div>
          </div>
        </div>

        <Button
          onClick={generateTailoredText}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md"
        >
          Generate Tailored CV Content
        </Button>

        <Tabs defaultValue="cv-template" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-700">
            <TabsTrigger
              value="cv-template"
              className="text-gray-200 data-[state=active]:bg-gray-600 data-[state=active]:text-white"
            >
              Tailored Content
            </TabsTrigger>
            <TabsTrigger
              value="raw-output"
              className="text-gray-200 data-[state=active]:bg-gray-600 data-[state=active]:text-white"
            >
              Raw LLM Output (Debug)
            </TabsTrigger>
          </TabsList>
          <TabsContent value="cv-template" className="mt-4">
            <Label htmlFor="tailored-cv" className="text-lg font-semibold mb-2 text-gray-200">
              Generated Tailored CV
            </Label>
            <Textarea
              id="tailored-cv"
              value={tailoredCVText}
              onChange={(e) => setTailoredCVText(e.target.value)}
              rows={15}
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 font-mono resize-y"
              placeholder="Tailored CV content will appear here..."
            />
            {tailoredCVText && (
              <Button
                onClick={() => navigator.clipboard.writeText(tailoredCVText)}
                className="mt-2 bg-green-600 hover:bg-green-700 text-white"
              >
                Copy to Clipboard
              </Button>
            )}
          </TabsContent>
          <TabsContent value="raw-output" className="mt-4">
            <Label htmlFor="raw-llm-output" className="text-lg font-semibold mb-2 text-gray-200">
              Raw LLM Output
            </Label>
            <Textarea
              id="raw-llm-output"
              value="This would contain the raw, unformatted LLM output for debugging purposes."
              readOnly
              rows={15}
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 font-mono resize-y"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
