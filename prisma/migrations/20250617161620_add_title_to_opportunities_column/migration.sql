/*
  Warnings:

  - You are about to drop the column `linkedin` on the `stakeholders` table. All the data in the column will be lost.
  - Added the required column `title` to the `opportunities` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OpportunityPriority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- AlterTable
ALTER TABLE "opportunities" ADD COLUMN     "attachments" TEXT[],
ADD COLUMN     "contact" TEXT,
ADD COLUMN     "contact_email" TEXT,
ADD COLUMN     "contact_person" TEXT,
ADD COLUMN     "date_identified" TIMESTAMPTZ,
ADD COLUMN     "deadline" TIMESTAMPTZ,
ADD COLUMN     "last_status_update" TIMESTAMPTZ,
ADD COLUMN     "next_action_date" TIMESTAMPTZ,
ADD COLUMN     "notion_page_id" TEXT,
ADD COLUMN     "priority" "OpportunityPriority",
ADD COLUMN     "related_evaluation_id" UUID,
ADD COLUMN     "source_url" TEXT,
ADD COLUMN     "stage" TEXT,
ADD COLUMN     "tailored_cv" TEXT,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "url" TEXT;

-- AlterTable
ALTER TABLE "stakeholders" DROP COLUMN "linkedin",
ADD COLUMN     "linkedin_url" TEXT;

-- CreateTable
CREATE TABLE "emotional_logs" (
    "id" UUID NOT NULL,
    "timestamp" TIMESTAMPTZ NOT NULL,
    "primaryEmotion" TEXT NOT NULL,
    "secondaryEmotions" JSONB NOT NULL,
    "intensity" INTEGER NOT NULL,
    "triggers" JSONB NOT NULL,
    "physicalSensations" JSONB NOT NULL,
    "accompanyingThoughts" TEXT NOT NULL,
    "copingMechanismsUsed" JSONB NOT NULL,
    "contextualNote" TEXT,
    "relatedJournalSourceId" UUID,
    "cognitiveDistortionAnalysis" JSONB,
    "emotion" TEXT NOT NULL,
    "context" TEXT NOT NULL,

    CONSTRAINT "emotional_logs_pkey" PRIMARY KEY ("id")
);
