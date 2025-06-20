-- AlterTable
ALTER TABLE "opportunities" ALTER COLUMN "company" DROP NOT NULL,
ALTER COLUMN "position" DROP NOT NULL,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "location" DROP NOT NULL;

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
