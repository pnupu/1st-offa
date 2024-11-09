/*
  Warnings:

  - You are about to drop the column `read` on the `GameEmail` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GameEmail" DROP COLUMN "read";

-- CreateTable
CREATE TABLE "GameEmailRead" (
    "id" TEXT NOT NULL,
    "emailId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameEmailRead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GameEmailRead_emailId_idx" ON "GameEmailRead"("emailId");

-- CreateIndex
CREATE INDEX "GameEmailRead_userId_idx" ON "GameEmailRead"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "GameEmailRead_emailId_userId_key" ON "GameEmailRead"("emailId", "userId");

-- AddForeignKey
ALTER TABLE "GameEmailRead" ADD CONSTRAINT "GameEmailRead_emailId_fkey" FOREIGN KEY ("emailId") REFERENCES "GameEmail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameEmailRead" ADD CONSTRAINT "GameEmailRead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
