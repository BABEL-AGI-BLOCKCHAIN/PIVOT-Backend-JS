/*
  Warnings:

  - You are about to drop the `Topic` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_topicId_fkey";

-- DropForeignKey
ALTER TABLE "Metadata" DROP CONSTRAINT "Metadata_topicId_fkey";

-- DropForeignKey
ALTER TABLE "Topic" DROP CONSTRAINT "Topic_promoterId_fkey";

-- DropTable
DROP TABLE "Topic";

-- CreateTable
CREATE TABLE "CreateTopic" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "investment" BIGINT NOT NULL DEFAULT 0,
    "promoterId" INTEGER,
    "position" INTEGER NOT NULL,
    "tokenAddress" TEXT NOT NULL,
    "nonce" TEXT NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "chainId" TEXT NOT NULL,

    CONSTRAINT "CreateTopic_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CreateTopic" ADD CONSTRAINT "CreateTopic_promoterId_fkey" FOREIGN KEY ("promoterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "CreateTopic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Metadata" ADD CONSTRAINT "Metadata_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "CreateTopic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
