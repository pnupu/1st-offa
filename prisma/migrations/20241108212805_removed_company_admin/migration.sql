/*
  Warnings:

  - You are about to drop the column `adminId` on the `Company` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_adminId_fkey";

-- DropIndex
DROP INDEX "Company_adminId_key";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "adminId";
