-- DropIndex
DROP INDEX "File_userId_key";

-- CreateIndex
CREATE INDEX "File_userId_idx" ON "File"("userId");
