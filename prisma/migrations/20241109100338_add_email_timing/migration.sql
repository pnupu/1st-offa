/*
  Warnings:

  - Added the required column `position` to the `GameEmail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sentTime` to the `GameEmail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GameEmail" ADD COLUMN     "position" TEXT NOT NULL,
ADD COLUMN     "sentTime" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "GameEmail_sentTime_idx" ON "GameEmail"("sentTime");
