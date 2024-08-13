/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `verification-tokens` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "verification-tokens_token_key" ON "verification-tokens"("token");
