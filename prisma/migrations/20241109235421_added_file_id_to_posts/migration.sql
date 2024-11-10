/*
  Warnings:

  - A unique constraint covering the columns `[fileId]` on the table `Post` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "fileId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Post_fileId_key" ON "Post"("fileId");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
