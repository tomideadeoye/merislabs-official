-- CreateEnum
CREATE TYPE "OpportunityType" AS ENUM ('job', 'project', 'collaboration', 'gig', 'other', 'educationProgram', 'projectCollaboration', 'funding', 'negotiating', 'declined', 'applicationReady', 'outreachPlanned', 'outreachSent', 'offerReceived');

-- CreateEnum
CREATE TYPE "REFACTOR TO INFERENCE TYPE SAFE FROM PRISMA. DERIVE FROM THERE" AS ENUM ('IDENTIFIED', 'RESEARCHING', 'APPLYING', 'INTERVIEWING', 'OFFERED', 'REJECTED', 'ACCEPTED', 'ARCHIVED', 'EVALUATING', 'evaluatedPositive', 'evaluatedNegative', 'applicationDrafting', 'interviewScheduled', 'interviewCompleted', 'APPLIED', 'PURSUING', 'NEGOTIATING', 'DECLINED', 'applicationReady', 'outreachPlanned', 'outreachSent', 'followUpNeeded', 'followUpSent', 'offerReceived', 'applyingNextStep', 'interviewingRound1', 'interviewingRound2', 'finalInterview', 'offerReceivedPendingReview', 'offerAccepted', 'offerRejected', 'activeOutreach', 'FOLLOW_UP', 'onHold', 'CONVERTED', 'rejectedByThem', 'declinedByMe');

-- CreateEnum
CREATE TYPE "OpportunityPriority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('TODO', 'DAILY', 'HABIT', 'REWARD', 'PROJECT', 'GOAL');

-- CreateEnum
CREATE TYPE "IdeaStatus" AS ENUM ('raw_spark', 'researching', 'developing', 'launched', 'abandoned');

-- CreateEnum
CREATE TYPE "IdeaPriority" AS ENUM ('high', 'medium', 'low');

-- CreateTable
CREATE TABLE "opportunities" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT,
    "type" "OpportunityType",
    "status" "REFACTOR TO INFERENCE TYPE SAFE FROM PRISMA. DERIVE FROM THERE",
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
    "WE NO LONGER USE NOTION, MIGRREATE ALL TO NEON/POSTGRESSDB/SCHEMA, ENSURE WE ARE COMPLETELY USING THE DB FROM NEON AND DELTE ALL MIGRATED FILES_page_id" TEXT,
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
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "emotional_logs_pkey" PRIMARY KEY ("id")
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
    "id" UUID NOT NULL,
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
    "title" TEXT,
    "tags" TEXT[],
    "contentType" TEXT,
    "WE NO LONGER USE NOTION, MIGRREATE ALL TO NEON/POSTGRESSDB/SCHEMA, ENSURE WE ARE COMPLETELY USING THE DB FROM NEON AND DELTE ALL MIGRATED FILESPageId" TEXT,
    "mood" TEXT,
    "reflectionId" TEXT,
    "originalEntryId" TEXT,
    "timestamp" TEXT,
    "emotion" TEXT,
    "primaryEmotion" TEXT,
    "intensity" INTEGER,
    "context" TEXT,
    "accompanyingThoughts" TEXT,
    "contextualNote" TEXT,
    "cognitiveDistortionAnalysis" JSONB,
    "secondaryEmotions" TEXT[],
    "triggers" TEXT[],
    "physicalSensations" TEXT[],
    "copingMechanismsUsed" TEXT[],
    "relatedJournalSourceId" TEXT,

    CONSTRAINT "journal_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "TaskStatus" NOT NULL,
    "priority" "TaskPriority" NOT NULL,
    "type" "TaskType" NOT NULL,
    "due_date" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "relatedLinks" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "relatedPhoneNumbers" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "related_contact_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],

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
    "apiEndpoint" TEXT NOT NULL,
    "parameters" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "user_defined_tools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "mobile" TEXT,
    "website" TEXT,
    "github" TEXT,
    "linkedin" TEXT,
    "substack" TEXT,
    "slideshare" TEXT,
    "medium" TEXT,
    "discord" TEXT,
    "merisLabsLinkedin" TEXT,
    "bioPitchLink" TEXT,
    "youtube" TEXT,
    "language" TEXT,
    "location" TEXT,
    "profileText" TEXT NOT NULL,
    "last_fetched_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" UUID NOT NULL,
    "firstName" TEXT,
    "middleName" TEXT,
    "lastName" TEXT,
    "phoneticFirstName" TEXT,
    "phoneticMiddleName" TEXT,
    "phoneticLastName" TEXT,
    "namePrefix" TEXT,
    "nameSuffix" TEXT,
    "nickname" TEXT,
    "fileAs" TEXT,
    "organizationName" TEXT,
    "organizationTitle" TEXT,
    "organizationDepartment" TEXT,
    "birthday" TIMESTAMP(3),
    "notes" TEXT,
    "photo" TEXT,
    "labels" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "email1Label" TEXT,
    "email1Value" TEXT,
    "email2Label" TEXT,
    "email2Value" TEXT,
    "email3Label" TEXT,
    "email3Value" TEXT,
    "email4Label" TEXT,
    "email4Value" TEXT,
    "phone1Label" TEXT,
    "phone_number" TEXT NOT NULL,
    "phone2Label" TEXT,
    "phone2Value" TEXT,
    "phone3Label" TEXT,
    "phone3Value" TEXT,
    "phone4Label" TEXT,
    "phone4Value" TEXT,
    "address1Label" TEXT,
    "address1Formatted" TEXT,
    "address1Street" TEXT,
    "address1City" TEXT,
    "address1PoBox" TEXT,
    "address1Region" TEXT,
    "address1PostalCode" TEXT,
    "address1Country" TEXT,
    "address1ExtendedAddress" TEXT,
    "address2Label" TEXT,
    "address2Formatted" TEXT,
    "address2Street" TEXT,
    "address2City" TEXT,
    "address2PoBox" TEXT,
    "address2Region" TEXT,
    "address2PostalCode" TEXT,
    "address2Country" TEXT,
    "address2ExtendedAddress" TEXT,
    "website1Label" TEXT,
    "website1Value" TEXT,
    "customField1Label" TEXT,
    "customField1Value" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "prompts_uniqueId_key" ON "prompts"("uniqueId");

-- CreateIndex
CREATE UNIQUE INDEX "cv_components_uniqueId_key" ON "cv_components"("uniqueId");

-- CreateIndex
CREATE UNIQUE INDEX "llm_settings_userId_key" ON "llm_settings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_defined_tools_name_key" ON "user_defined_tools"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_userId_key" ON "user_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "contacts_phone_number_key" ON "contacts"("phone_number");

-- AddForeignKey
ALTER TABLE "stakeholders" ADD CONSTRAINT "stakeholders_opportunity_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_drafts" ADD CONSTRAINT "application_drafts_opportunity_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "idea_logs" ADD CONSTRAINT "idea_logs_idea_id_fkey" FOREIGN KEY ("idea_id") REFERENCES "ideas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_steps" ADD CONSTRAINT "task_steps_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
