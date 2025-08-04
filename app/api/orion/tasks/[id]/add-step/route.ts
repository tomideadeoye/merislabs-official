/**
 * @fileoverview API route for adding a new step (or reply) to a task in Orion's internal task management system.
 * @description This route allows users (or agents) to add a step to a task, supporting both top-level steps and threaded replies. It leverages the taskDbService.addStepToTask utility for robust, DRY logic and returns the updated task with all steps. Copious logging is included for traceability and debugging.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Provide a robust API endpoint (`POST`) for adding steps to tasks, including threaded replies.
 *   - Support agentic workflows by allowing rich step data (prompt, generatedOptions, toolCalls, etc.).
 *   - Ensure data integrity and context-rich logging for all operations.
 *   - Return the updated task with all steps for immediate UI refresh.
 *
 * FILEPATH: app/api/orion/tasks/[id]/add-step/route.ts
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - Uses taskDbService.addStepToTask from app/lib/task_db_service.ts for business logic.
 *   - Consumed by TaskStepTimeline and AgenticWorkflowComponent for manual and agent-driven step addition.
 *   - Related to Task and TaskStep models in prisma/schema.prisma.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes userId is hardcoded as 'unauthenticated_user' (until auth is reintroduced).
 *   - Assumes prompt is required; other fields are optional.
 *   - Assumes frontend expects updated task with steps on success.
 *
 * NOTES:
 *   - [PERFORMANCE OPTIMIZATIONS]: Consider batching step additions in the future.
 *   - [ERROR HANDLING ROBUSTNESS]: All errors are logged and surfaced in the response.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - Add Zod schema validation for request body.
 *   - Support optimistic UI updates and granular error codes.
 *   - Add more granular logging for each internal step.
 */
import { NextResponse } from 'next/server';
import { taskDbService } from '@/lib/task_db_service';
import logger from '@/lib/logger';

export async function POST(req: Request, { params }: { params: { id: string } }) {
    const userId = 'unauthenticated_user'; // Hardcoded userId as authentication is removed
    const { id: taskId } = params;
    const logContext = {
        route: '/api/orion/tasks/[id]/add-step',
        operation: 'POST',
        timestamp: new Date().toISOString(),
        userId,
        taskId,
    };
    logger.info('[ADD_STEP_API][START]', logContext);
    try {
        const body = await req.json();
        const { prompt, generatedOptions, parentStepId, toolCalls, memoryReferences, relatedLinks, relatedPhoneNumbers, finalLog } = body;
        if (!prompt) {
            logger.warn('[ADD_STEP_API][VALIDATION][MISSING_PROMPT]', { ...logContext, body });
            return NextResponse.json({ success: false, error: 'Prompt is required.' }, { status: 400 });
        }
        // Prepare stepData for service
        const stepData = {
            prompt,
            generatedOptions: generatedOptions || [],
            toolCalls: toolCalls || null,
            memoryReferences: memoryReferences || null,
            relatedLinks: relatedLinks || null,
            relatedPhoneNumbers: relatedPhoneNumbers || null,
            finalLog: finalLog || null,
            parentStepId: parentStepId || undefined,
        };
        logger.info('[ADD_STEP_API][CALL_SERVICE]', { ...logContext, stepData });
        const updatedTask = await taskDbService.addStepToTask(taskId, stepData);
        logger.success('[ADD_STEP_API][SUCCESS]', { ...logContext, updatedTaskId: updatedTask.id });
        return NextResponse.json({ success: true, task: updatedTask });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error.';
        logger.error('[ADD_STEP_API][ERROR]', { ...logContext, error: errorMessage });
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}
