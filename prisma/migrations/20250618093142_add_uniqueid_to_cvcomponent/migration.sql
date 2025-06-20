-- AlterTable
ALTER TABLE "opportunities" ADD COLUMN     "evaluationResult" JSONB,
ADD COLUMN     "tailoredCvId" TEXT;

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

-- CreateIndex
CREATE UNIQUE INDEX "cv_components_uniqueId_key" ON "cv_components"("uniqueId");
