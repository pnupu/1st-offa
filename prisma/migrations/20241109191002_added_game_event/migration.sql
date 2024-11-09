-- CreateTable
CREATE TABLE "GameEvent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "openness" DOUBLE PRECISION,
    "conscientiousness" DOUBLE PRECISION,
    "extraversion" DOUBLE PRECISION,
    "agreeableness" DOUBLE PRECISION,
    "neuroticism" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GameEvent_userId_idx" ON "GameEvent"("userId");

-- CreateIndex
CREATE INDEX "GameEvent_type_idx" ON "GameEvent"("type");

-- AddForeignKey
ALTER TABLE "GameEvent" ADD CONSTRAINT "GameEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
