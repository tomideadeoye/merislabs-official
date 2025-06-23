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
CREATE TABLE "llm_settings" (
    "id" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "globalDefaultModel" TEXT,
    "requestTypeOverrides" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "llm_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "prompts_uniqueId_key" ON "prompts"("uniqueId");

-- CreateIndex
CREATE UNIQUE INDEX "llm_settings_userId_key" ON "llm_settings"("userId");
