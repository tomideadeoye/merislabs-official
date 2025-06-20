/*
  Warnings:

  - The primary key for the `emotional_logs` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "emotional_logs" DROP CONSTRAINT "emotional_logs_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "timestamp" SET DATA TYPE TEXT,
ALTER COLUMN "secondaryEmotions" DROP NOT NULL,
ALTER COLUMN "secondaryEmotions" SET DATA TYPE TEXT,
ALTER COLUMN "triggers" DROP NOT NULL,
ALTER COLUMN "triggers" SET DATA TYPE TEXT,
ALTER COLUMN "physicalSensations" DROP NOT NULL,
ALTER COLUMN "physicalSensations" SET DATA TYPE TEXT,
ALTER COLUMN "copingMechanismsUsed" DROP NOT NULL,
ALTER COLUMN "copingMechanismsUsed" SET DATA TYPE TEXT,
ALTER COLUMN "relatedJournalSourceId" SET DATA TYPE TEXT,
ALTER COLUMN "cognitiveDistortionAnalysis" SET DATA TYPE TEXT,
ADD CONSTRAINT "emotional_logs_pkey" PRIMARY KEY ("id");
