-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "username" TEXT,
    "twitterHandle" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" INTEGER,
    "topicId" TEXT,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Metadata" (
    "topicId" TEXT NOT NULL,
    "topic_title" TEXT NOT NULL,
    "topic_content" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,

    CONSTRAINT "Metadata_pkey" PRIMARY KEY ("topicId")
);

-- CreateTable
CREATE TABLE "EventSync" (
    "eventName" TEXT NOT NULL,
    "lastBlock" BIGINT NOT NULL,

    CONSTRAINT "EventSync_pkey" PRIMARY KEY ("eventName")
);

-- CreateTable
CREATE TABLE "Invest" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "topicId" TEXT,
    "amount" BIGINT NOT NULL,
    "position" INTEGER NOT NULL,
    "nonce" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "chainId" TEXT NOT NULL,

    CONSTRAINT "Invest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "User"("walletAddress");

-- AddForeignKey
ALTER TABLE "CreateTopic" ADD CONSTRAINT "CreateTopic_promoterId_fkey" FOREIGN KEY ("promoterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "CreateTopic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Metadata" ADD CONSTRAINT "Metadata_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "CreateTopic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invest" ADD CONSTRAINT "Invest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invest" ADD CONSTRAINT "Invest_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "CreateTopic"("id") ON DELETE SET NULL ON UPDATE CASCADE;
