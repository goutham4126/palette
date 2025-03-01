-- CreateTable
CREATE TABLE "Manualproject" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "htmlCode" TEXT,
    "cssCode" TEXT,
    "jsCode" TEXT,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Manualproject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aiproject" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "htmlCode" TEXT,
    "cssCode" TEXT,
    "jsCode" TEXT,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Aiproject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Manualproject_title_key" ON "Manualproject"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Aiproject_title_key" ON "Aiproject"("title");

-- AddForeignKey
ALTER TABLE "Manualproject" ADD CONSTRAINT "Manualproject_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aiproject" ADD CONSTRAINT "Aiproject_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
