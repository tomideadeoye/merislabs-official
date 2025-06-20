-- CreateEnum
CREATE TYPE "IdeaStatus" AS ENUM ('raw_spark', 'researching', 'developing', 'launched', 'abandoned');

-- CreateEnum
CREATE TYPE "IdeaPriority" AS ENUM ('high', 'medium', 'low');

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

-- AddForeignKey
ALTER TABLE "idea_logs" ADD CONSTRAINT "idea_logs_idea_id_fkey" FOREIGN KEY ("idea_id") REFERENCES "ideas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
