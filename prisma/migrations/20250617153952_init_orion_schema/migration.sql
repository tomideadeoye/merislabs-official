-- CreateEnum
CREATE TYPE "OpportunityType" AS ENUM ('job', 'project', 'collaboration', 'gig', 'other', 'educationProgram', 'projectCollaboration', 'funding', 'negotiating', 'declined', 'applicationReady', 'outreachPlanned', 'outreachSent', 'offerReceived');

-- CreateEnum
CREATE TYPE "OpportunityStatus" AS ENUM ('IDENTIFIED', 'RESEARCHING', 'APPLYING', 'INTERVIEWING', 'OFFERED', 'REJECTED', 'ACCEPTED', 'ARCHIVED', 'EVALUATING', 'evaluatedPositive', 'evaluatedNegative', 'applicationDrafting', 'interviewScheduled', 'interviewCompleted', 'APPLIED', 'PURSUING', 'NEGOTIATING', 'DECLINED', 'applicationReady', 'outreachPlanned', 'outreachSent', 'followUpNeeded', 'followUpSent', 'offerReceived', 'applyingNextStep', 'interviewingRound1', 'interviewingRound2', 'finalInterview', 'offerReceivedPendingReview', 'offerAccepted', 'offerRejected', 'activeOutreach', 'FOLLOW_UP', 'onHold', 'CONVERTED', 'rejectedByThem', 'declinedByMe');

-- CreateTable
CREATE TABLE "opportunities" (
    "id" UUID NOT NULL,
    "company" TEXT NOT NULL,
    "type" "OpportunityType" NOT NULL,
    "position" TEXT NOT NULL,
    "status" "OpportunityStatus" NOT NULL,
    "location" TEXT NOT NULL,
    "salary" TEXT,
    "description" TEXT,
    "requirements" TEXT[],
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stakeholders" (
    "id" UUID NOT NULL,
    "opportunity_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "email" TEXT,
    "linkedin" TEXT,
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

-- AddForeignKey
ALTER TABLE "stakeholders" ADD CONSTRAINT "stakeholders_opportunity_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_drafts" ADD CONSTRAINT "application_drafts_opportunity_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
