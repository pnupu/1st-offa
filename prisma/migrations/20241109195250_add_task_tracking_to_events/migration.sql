-- AlterTable
ALTER TABLE "GameEvent" ADD COLUMN     "completionTime" DOUBLE PRECISION,
ADD COLUMN     "taskId" TEXT,
ADD COLUMN     "taskTitle" TEXT;

-- CreateIndex
CREATE INDEX "GameEvent_taskId_idx" ON "GameEvent"("taskId");
