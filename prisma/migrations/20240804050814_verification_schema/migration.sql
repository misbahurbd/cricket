-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('Verify', 'Reset');

-- AlterTable
ALTER TABLE "accounts" ALTER COLUMN "accessToken" DROP NOT NULL;

-- CreateTable
CREATE TABLE "verification-tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "tokenType" "TokenType" NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification-tokens_pkey" PRIMARY KEY ("identifier","token")
);
