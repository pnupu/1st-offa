-- AlterTable
ALTER TABLE "GameEvent" ADD COLUMN     "score" INTEGER;

-- CreateIndex
CREATE INDEX "GameEvent_score_idx" ON "GameEvent"("score");
