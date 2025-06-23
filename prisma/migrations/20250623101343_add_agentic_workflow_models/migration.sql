-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED', 'ON_HOLD');

-- CreateTable
CREATE TABLE "cv_feedback" (
    "id" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "opportunityId" UUID NOT NULL,
    "feedbackType" TEXT NOT NULL,
    "feedbackDetails" TEXT NOT NULL,
    "componentId" UUID,
    "originalContent" TEXT,
    "generatedContent" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cv_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_steps" (
    "id" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "prompt" TEXT NOT NULL,
    "generated_options" JSONB NOT NULL,
    "chosen_action" TEXT,
    "final_log" TEXT,
    "tool_calls" JSONB,
    "memory_references" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "taskId" TEXT NOT NULL,

    CONSTRAINT "task_steps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "task_steps_taskId_stepNumber_key" ON "task_steps"("taskId", "stepNumber");

-- AddForeignKey
ALTER TABLE "task_steps" ADD CONSTRAINT "task_steps_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
