/*
  Warnings:

  - You are about to drop the column `cl` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "cl",
ADD COLUMN     "standard" TEXT;
