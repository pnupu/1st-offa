-- CreateTable
CREATE TABLE "GameEmail" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameEmail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameEmailReply" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "emailId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameEmailReply_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GameEmail_order_idx" ON "GameEmail"("order");

-- CreateIndex
CREATE INDEX "GameEmailReply_emailId_idx" ON "GameEmailReply"("emailId");

-- AddForeignKey
ALTER TABLE "GameEmailReply" ADD CONSTRAINT "GameEmailReply_emailId_fkey" FOREIGN KEY ("emailId") REFERENCES "GameEmail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
