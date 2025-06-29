/*
  Warnings:

  - You are about to drop the column `WE NO LONGER USE NOTION, MIGRREATE ALL TO NEON/POSTGRESSDB/SCHE` on the `journal_entries` table. All the data in the column will be lost.
  - You are about to drop the column `WE NO LONGER USE NOTION, MIGRREATE ALL TO NEON/POSTGRESSDB/SCHE` on the `opportunities` table. All the data in the column will be lost.
  - The `status` column on the `opportunities` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "OpportunityStatus" AS ENUM ('IDENTIFIED', 'RESEARCHING', 'APPLYING', 'INTERVIEWING', 'OFFERED', 'REJECTED', 'ACCEPTED', 'ARCHIVED', 'EVALUATING', 'evaluatedPositive', 'evaluatedNegative', 'applicationDrafting', 'interviewScheduled', 'interviewCompleted', 'APPLIED', 'PURSUING', 'NEGOTIATING', 'DECLINED', 'applicationReady', 'outreachPlanned', 'outreachSent', 'followUpNeeded', 'followUpSent', 'offerReceived', 'applyingNextStep', 'interviewingRound1', 'interviewingRound2', 'finalInterview', 'offerReceivedPendingReview', 'offerAccepted', 'offerRejected', 'activeOutreach', 'FOLLOW_UP', 'onHold', 'CONVERTED', 'rejectedByThem', 'declinedByMe');

-- AlterTable
ALTER TABLE "journal_entries" DROP COLUMN "WE NO LONGER USE NOTION, MIGRREATE ALL TO NEON/POSTGRESSDB/SCHE";

-- AlterTable
ALTER TABLE "opportunities" DROP COLUMN "WE NO LONGER USE NOTION, MIGRREATE ALL TO NEON/POSTGRESSDB/SCHE",
DROP COLUMN "status",
ADD COLUMN     "status" "OpportunityStatus";

-- AlterTable
ALTER TABLE "task_steps" ADD COLUMN     "parentStepId" UUID;

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- DropEnum
DROP TYPE "REFACTOR TO INFERENCE TYPE SAFE FROM PRISMA. DERIVE FROM THERE";

-- AddForeignKey
ALTER TABLE "task_steps" ADD CONSTRAINT "task_steps_parentStepId_fkey" FOREIGN KEY ("parentStepId") REFERENCES "task_steps"("id") ON DELETE SET NULL ON UPDATE CASCADE;
