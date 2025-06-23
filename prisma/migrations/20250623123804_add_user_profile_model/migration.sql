/*
  Warnings:

  - You are about to drop the column `api_endpoint` on the `user_defined_tools` table. All the data in the column will be lost.
  - Added the required column `apiEndpoint` to the `user_defined_tools` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_defined_tools" DROP COLUMN "api_endpoint",
ADD COLUMN     "apiEndpoint" TEXT NOT NULL;

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

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_userId_key" ON "user_profiles"("userId");
