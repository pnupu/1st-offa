/*
  Warnings:

  - Added the required column `userId` to the `GameEmailReply` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GameEmailReply" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "GameEmailReply_userId_idx" ON "GameEmailReply"("userId");

-- AddForeignKey
ALTER TABLE "GameEmailReply" ADD CONSTRAINT "GameEmailReply_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
