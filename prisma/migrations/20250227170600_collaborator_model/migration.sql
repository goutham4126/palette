/*
  Warnings:

  - You are about to drop the `Aiproject` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "AccessType" AS ENUM ('NONE', 'VIEW', 'EDIT');

-- DropForeignKey
ALTER TABLE "Aiproject" DROP CONSTRAINT "Aiproject_creatorId_fkey";

-- DropTable
DROP TABLE "Aiproject";

-- CreateTable
CREATE TABLE "Collaborator" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "accessType" "AccessType" NOT NULL DEFAULT 'NONE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collaborator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Collaborator_email_projectId_key" ON "Collaborator"("email", "projectId");

-- AddForeignKey
ALTER TABLE "Collaborator" ADD CONSTRAINT "Collaborator_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Manualproject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
