/**
 * @fileoverview TaskStepTimeline renders a threaded, interactive timeline of task steps with support for multi-level replies.
 * @description This component displays all steps for a task as a tree, allowing users to reply to any step (not just the latest), with replies visually nested. Each reply is saved as a new step linked to its parent, enabling agentic workflows and deep context. Copious logging is included for all reply actions.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Render a threaded, recursive timeline of task steps and their replies.
 *   - Allow users to add a reply/context to any step, not just the latest.
 *   - Visually nest replies for clarity and engagement.
 *   - Log all reply actions for traceability and debugging.
 *   - Directly supports agentic workflow, context-rich decision making, and productivity.
 *
 * FILEPATH: app/components/orion/tasks/TaskStepTimeline.tsx
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - Consumes TaskStep type from app/lib/types/index.ts.
 *   - Used by AgenticWorkflowComponent (app/components/orion/admin/AgenticWorkflowComponent.tsx).
 *   - Calls backend API to add replies as threaded steps.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes steps are passed as a tree (root steps with nested replies).
 *   - Assumes backend supports parentStepId for threaded replies.
 *   - Assumes logger is globally available or imported.
 *
 * NOTES:
 *   - [COMPONENTS TO MERGE WITH / OPPORTUNITIES TO CONSOLIDATE]: Could be unified with other timeline or threaded comment components.
 *   - [PERFORMANCE OPTIMIZATIONS]: Consider virtualization for very large step trees.
 *   - [ERROR HANDLING ROBUSTNESS]: All reply actions are logged; errors are surfaced in the UI.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - Add optimistic UI updates for replies.
 *   - Support editing/deleting replies.
 *   - Add more granular logging for each internal step.
 *   - Explore adding AI summarization of threads.
 */
import React, { useState } from 'react';
import { TaskStep } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, HelpCircle, MessageSquare, FileText, CornerDownRight } from 'lucide-react';
import apiClient from '@/lib/apiClient';
import logger from '@/lib/logger';

// --- Type for generatedOptions ---
type GeneratedOption = { action: string; justification: string };

type TaskStepWithReplies = TaskStep & {
  generatedOptions?: GeneratedOption[];
  replies?: TaskStepWithReplies[];
};

interface TaskStepTimelineProps {
  steps: TaskStepWithReplies[];
  id?: string;
}

const ThreadedStep: React.FC<{ step: TaskStepWithReplies; isLast: boolean; depth: number; id?: string }> = ({
  step,
  isLast,
  depth,
  id,
}) => {
  const [reply, setReply] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

  const getIcon = () => {
    if (step.chosenAction) {
      return <CheckCircle className="h-5 w-5 text-green-400" />;
    }
    if (step.generatedOptions && step.generatedOptions.length > 0) {
      return <HelpCircle className="h-5 w-5 text-yellow-400" />;
    }
    return <MessageSquare className="h-5 w-5 text-blue-400" />;
  };

  // --- Step Approval State ---
  const [isApproving, setIsApproving] = useState(false);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [customAction, setCustomAction] = useState('');
  const [customJustification, setCustomJustification] = useState('');
  const [approveLoading, setApproveLoading] = useState(false);
  const [approveError, setApproveError] = useState<string | null>(null);

  const handleApprove = async () => {
    setApproveLoading(true);
    setApproveError(null);
    let chosenAction = '';
    let chosenJustification = '';
    if (
      step.generatedOptions &&
      step.generatedOptions.length > 0 &&
      selectedOptionIdx !== null
    ) {
      const opt = step.generatedOptions[selectedOptionIdx];
      chosenAction = opt?.action || '';
      chosenJustification = opt?.justification || '';
    } else {
      chosenAction = customAction;
      chosenJustification = customJustification;
    }
    try {
      const response = await apiClient.post(`/api/orion/tasks/${id}/approve-step`, {
        stepId: step.id,
        chosenAction,
        chosenJustification,
      });
      if (response.data.success) {
        setIsApproving(false);
        setCustomAction('');
        setCustomJustification('');
        setSelectedOptionIdx(null);
        logger.success('[TASK_STEP_TIMELINE][APPROVE][SUCCESS]', { stepId: step.id, chosenAction, chosenJustification });
        // Optionally trigger a refresh or callback
      } else {
        setApproveError(response.data.error || 'Failed to approve step');
        logger.error('[TASK_STEP_TIMELINE][APPROVE][ERROR]', { stepId: step.id, error: response.data.error });
      }
    } catch (err: unknown) {
      setApproveError(err instanceof Error ? err.message : String(err));
      logger.error('[TASK_STEP_TIMELINE][APPROVE][EXCEPTION]', { stepId: step.id, error: err });
    } finally {
      setApproveLoading(false);
    }
  };

  const handleReply = async () => {
    if (!reply.trim() || !id) return;
    setLoading(true);
    setError(null);
    logger.info('[TASK_STEP_TIMELINE][REPLY][START]', { id, parentStepId: step.id, reply });
    try {
      const response = await apiClient.post(`/api/orion/tasks/${id}/add-step`, {
        prompt: reply,
        generatedOptions: [],
        parentStepId: step.id,
      });
      if (response.data.success) {
        setReply('');
        setIsReplying(false);
        logger.success('[TASK_STEP_TIMELINE][REPLY][SUCCESS]', { id, parentStepId: step.id, reply });
        // Optionally trigger a refresh or callback
      } else {
        setError(response.data.error || 'Failed to add reply');
        logger.error('[TASK_STEP_TIMELINE][REPLY][ERROR]', {
          id,
          parentStepId: step.id,
          error: response.data.error,
        });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
      logger.error('[TASK_STEP_TIMELINE][REPLY][EXCEPTION]', { id, parentStepId: step.id, error: err });
    } finally {
      setLoading(false);
    }
  };

  return (
    <li className={`relative pl-8 ${depth > 0 ? 'ml-8 border-l-2 border-purple-700' : ''}`}>
      {' '}
      {/* Indent for replies */}
      {/* Timeline line for non-last steps */}
      {!isLast && <div className="absolute left-4 top-5 -bottom-5 w-0.5 bg-gray-600"></div>}
      {/* Timeline dot/icon */}
      <div className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 ring-4 ring-gray-800">
        {getIcon()}
      </div>
      {/* Content card */}
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
              step.generatedOptions.length > 0 &&
              !step.chosenAction && (
                <div>
                  <p className="font-semibold text-blue-400 flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Generated Options (Pending Choice):
                  </p>
                  <ul className="list-disc pl-10 space-y-1 mt-1">
                    {step.generatedOptions.map((option, optIdx) => (
                      <li key={optIdx} className="text-gray-300">
                        <span className="font-bold">{option.action}</span> -{' '}
                        <span className="text-gray-400 italic">{option.justification}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            {/* Reply input */}
            <div className="mt-3">
              <button
                className="flex items-center text-purple-400 hover:text-purple-200 text-xs font-semibold mb-1"
                onClick={() => setIsReplying((v) => !v)}
              >
                <CornerDownRight className="h-4 w-4 mr-1" />
                {isReplying ? 'Cancel' : 'Reply/Context'}
              </button>
              {isReplying && (
                <div className="flex flex-col gap-2">
                  <textarea
                    className="bg-gray-700 text-gray-200 border-gray-600 focus:border-blue-500 rounded p-2"
                    placeholder="Type your reply/context for this step..."
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    rows={2}
                  />
                  <button
                    className="bg-purple-600 hover:bg-purple-700 text-white rounded px-3 py-1 text-xs font-bold"
                    onClick={handleReply}
                    disabled={loading || !reply.trim()}
                  >
                    {loading ? 'Adding...' : 'Add Reply/Context'}
                  </button>
                  {error && <p className="text-red-400 text-xs">{error}</p>}
                </div>
              )}
            </div>
            {/* Show/hide replies toggle */}
            {(step.replies ?? []).length > 0 && (
              <button
                className="text-xs text-blue-300 hover:text-blue-100 mt-2"
                onClick={() => setShowReplies((v) => !v)}
              >
                {showReplies ? 'Hide Replies' : `Show Replies (${(step.replies ?? []).length})`}
              </button>
            )}
            {/* Render replies recursively */}
            {showReplies && (step.replies ?? []).length > 0 && (
              <ol className="space-y-4 mt-2">
                {(step.replies ?? []).map((replyStep, idx, arr) => (
                  <ThreadedStep
                    key={replyStep.id}
                    step={replyStep}
                    isLast={idx === arr.length - 1}
                    depth={depth + 1}
                    id={id}
                  />
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
      </div>
    </li>
  );
};

export const TaskStepTimeline: React.FC<TaskStepTimelineProps> = ({ steps, id }) => {
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
          <ThreadedStep key={step.id} step={step} isLast={index === steps.length - 1} depth={0} id={id} />
        ))}
      </ol>
    </div>
  );
};
