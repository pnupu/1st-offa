/*
  Warnings:

  - A unique constraint covering the columns `[companyId]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_logoId_fkey";

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "companyId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "File_companyId_key" ON "File"("companyId");
