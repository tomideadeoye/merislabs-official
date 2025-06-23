-- CreateEnum
CREATE TYPE "OpportunityType" AS ENUM ('job', 'project', 'collaboration', 'gig', 'other', 'educationProgram', 'projectCollaboration', 'funding', 'negotiating', 'declined', 'applicationReady', 'outreachPlanned', 'outreachSent', 'offerReceived');

-- CreateEnum
CREATE TYPE "OpportunityStatus" AS ENUM ('IDENTIFIED', 'RESEARCHING', 'APPLYING', 'INTERVIEWING', 'OFFERED', 'REJECTED', 'ACCEPTED', 'ARCHIVED', 'EVALUATING', 'evaluatedPositive', 'evaluatedNegative', 'applicationDrafting', 'interviewScheduled', 'interviewCompleted', 'APPLIED', 'PURSUING', 'NEGOTIATING', 'DECLINED', 'applicationReady', 'outreachPlanned', 'outreachSent', 'followUpNeeded', 'followUpSent', 'offerReceived', 'applyingNextStep', 'interviewingRound1', 'interviewingRound2', 'finalInterview', 'offerReceivedPendingReview', 'offerAccepted', 'offerRejected', 'activeOutreach', 'FOLLOW_UP', 'onHold', 'CONVERTED', 'rejectedByThem', 'declinedByMe');

-- CreateEnum
CREATE TYPE "OpportunityPriority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "IdeaStatus" AS ENUM ('raw_spark', 'researching', 'developing', 'launched', 'abandoned');

-- CreateEnum
CREATE TYPE "IdeaPriority" AS ENUM ('high', 'medium', 'low');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateTable
CREATE TABLE "opportunities" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT,
    "type" "OpportunityType",
    "status" "OpportunityStatus",
    "description" TEXT,
    "url" TEXT,
    "requirements" TEXT[],
    "date_identified" TIMESTAMPTZ,
    "notes" TEXT,
    "contact_person" TEXT,
    "contact_email" TEXT,
    "stage" TEXT,
    "attachments" TEXT[],
    "related_evaluation_id" UUID,
    "source_url" TEXT,
    "next_action_date" TIMESTAMPTZ,
    "priority" "OpportunityPriority",
    "tailored_cv" TEXT,
    "deadline" TIMESTAMPTZ,
    "location" TEXT,
    "salary" TEXT,
    "contact" TEXT,
    "position" TEXT,
    "last_status_update" TIMESTAMPTZ,
    "notion_page_id" TEXT,
    "applicationMaterialIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "evaluationResult" JSONB,
    "tailoredCvId" TEXT,
    "userId" TEXT,

    CONSTRAINT "opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stakeholders" (
    "id" UUID NOT NULL,
    "opportunity_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "email" TEXT,
    "linkedin_url" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "stakeholders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_drafts" (
    "id" UUID NOT NULL,
    "opportunity_id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "application_drafts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompts" (
    "id" UUID NOT NULL,
    "uniqueId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "prompts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emotional_logs" (
    "id" TEXT NOT NULL,
    "timestamp" TEXT NOT NULL,
    "primaryEmotion" TEXT NOT NULL,
    "secondaryEmotions" TEXT,
    "intensity" INTEGER NOT NULL,
    "triggers" TEXT,
    "physicalSensations" TEXT,
    "accompanyingThoughts" TEXT NOT NULL,
    "copingMechanismsUsed" TEXT,
    "contextualNote" TEXT,
    "relatedJournalSourceId" TEXT,
    "cognitiveDistortionAnalysis" TEXT,
    "emotion" TEXT NOT NULL,
    "context" TEXT NOT NULL,

    CONSTRAINT "emotional_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habitica_task_links" (
    "id" TEXT NOT NULL,
    "habiticaTaskId" TEXT NOT NULL,
    "orionSourceModule" TEXT NOT NULL,
    "orionSourceReferenceId" TEXT NOT NULL,
    "orionTaskText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "habitica_task_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ideas" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "IdeaStatus" NOT NULL DEFAULT 'raw_spark',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "due_date" TIMESTAMPTZ,
    "priority" "IdeaPriority",
    "userId" TEXT NOT NULL,

    CONSTRAINT "ideas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "idea_logs" (
    "id" UUID NOT NULL,
    "idea_id" UUID NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "log_type" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT,
    "author" TEXT,

    CONSTRAINT "idea_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_components" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "userId" TEXT NOT NULL,
    "uniqueId" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "cv_components_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "llm_settings" (
    "id" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "globalDefaultModel" TEXT,
    "requestTypeOverrides" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "llm_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journal_entries" (
    "id" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "content" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "journal_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'TODO',
    "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "due_date" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_steps" (
    "id" UUID NOT NULL,
    "task_id" UUID NOT NULL,
    "step_number" INTEGER NOT NULL,
    "prompt" TEXT NOT NULL,
    "generated_options" JSONB NOT NULL,
    "chosen_action" TEXT,
    "chosen_justification" TEXT,
    "tool_calls" JSONB,
    "memory_references" JSONB,
    "related_links" JSONB,
    "related_phone_numbers" JSONB,
    "final_log" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "task_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_defined_tools" (
    "id" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "api_endpoint" TEXT NOT NULL,
    "parameters" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "user_defined_tools_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "prompts_uniqueId_key" ON "prompts"("uniqueId");

-- CreateIndex
CREATE UNIQUE INDEX "cv_components_uniqueId_key" ON "cv_components"("uniqueId");

-- CreateIndex
CREATE UNIQUE INDEX "llm_settings_userId_key" ON "llm_settings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_defined_tools_name_key" ON "user_defined_tools"("name");

-- AddForeignKey
ALTER TABLE "stakeholders" ADD CONSTRAINT "stakeholders_opportunity_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_drafts" ADD CONSTRAINT "application_drafts_opportunity_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "idea_logs" ADD CONSTRAINT "idea_logs_idea_id_fkey" FOREIGN KEY ("idea_id") REFERENCES "ideas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_steps" ADD CONSTRAINT "task_steps_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
