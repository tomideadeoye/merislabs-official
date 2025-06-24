import React from 'react';
import { TaskStep } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, HelpCircle, MessageSquare, FileText } from 'lucide-react';

interface TaskStepTimelineProps {
  steps: TaskStep[];
}

const TaskStepItem: React.FC<{ step: TaskStep; isLast: boolean }> = ({ step, isLast }) => {
  const getIcon = () => {
    if (step.chosenAction) {
      return <CheckCircle className="h-5 w-5 text-green-400" />;
    }
    if (step.generatedOptions && (step.generatedOptions as any[]).length > 0) {
      return <HelpCircle className="h-5 w-5 text-yellow-400" />;
    }
    return <MessageSquare className="h-5 w-5 text-blue-400" />;
  };

  return (
    <li className="relative pl-8">
      {/* The vertical timeline line */}
      {!isLast && <div className="absolute left-4 top-5 -bottom-5 w-0.5 bg-gray-600"></div>}

      {/* The timeline dot/icon */}
      <div className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 ring-4 ring-gray-800">
        {getIcon()}
      </div>

      {/* The content card */}
      <div className="ml-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-md font-semibold text-gray-200">
                  Step {step.stepNumber}: {step.chosenAction ? 'Action Taken' : 'Decision Point'}
                </CardTitle>
                <p className="text-xs text-gray-400 mt-1">{new Date(step.createdAt).toLocaleString()}</p>
              </div>
              <Badge variant="secondary">{step.chosenAction ? 'Completed' : 'Pending Action'}</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3 text-sm">
            <div>
              <p className="font-semibold text-gray-400 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Initial Prompt/Note:
              </p>
              <p className="text-gray-300 pl-6">{step.prompt}</p>
            </div>

            {step.chosenAction && (
              <div>
                <p className="font-semibold text-green-400 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Chosen Action:
                </p>
                <p className="text-green-200 pl-6">{step.chosenAction}</p>
                {step.chosenJustification && (
                  <>
                    <p className="font-semibold text-yellow-400 mt-2 flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Justification:
                    </p>
                    <p className="text-yellow-200 pl-6">{step.chosenJustification}</p>
                  </>
                )}
              </div>
            )}

            {step.generatedOptions &&
              Array.isArray(step.generatedOptions) &&
              step.generatedOptions.length > 0 &&
              !step.chosenAction && (
                <div>
                  <p className="font-semibold text-blue-400 flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Generated Options (Pending Choice):
                  </p>
                  <ul className="list-disc pl-10 space-y-1 mt-1">
                    {(step.generatedOptions as any[]).map((option: any, optIdx: number) => (
                      <li key={optIdx} className="text-gray-300">
                        <span className="font-bold">{option.action}</span> -{' '}
                        <span className="text-gray-400 italic">{option.justification}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </CardContent>
        </Card>
      </div>
    </li>
  );
};

export const TaskStepTimeline: React.FC<TaskStepTimelineProps> = ({ steps }) => {
  if (!steps || steps.length === 0) {
    return (
      <p className="text-gray-400 text-center py-4">No steps found for this task. Generate some to get started!</p>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-200 mb-4">Task History Timeline</h3>
      <ol className="space-y-6">
        {steps.map((step, index) => (
          <TaskStepItem key={step.id} step={step} isLast={index === steps.length - 1} />
        ))}
      </ol>
    </div>
  );
};
