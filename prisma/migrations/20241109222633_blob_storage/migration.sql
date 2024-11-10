/*
  Warnings:

  - You are about to drop the column `url` on the `File` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fileId]` on the table `GameEvent` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `blob` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "url",
ADD COLUMN     "blob" BYTEA NOT NULL;

-- AlterTable
ALTER TABLE "GameEvent" ADD COLUMN     "fileId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "GameEvent_fileId_key" ON "GameEvent"("fileId");

-- AddForeignKey
ALTER TABLE "GameEvent" ADD CONSTRAINT "GameEvent_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
