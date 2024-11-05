/*
  Warnings:

  - You are about to drop the column `classId` on the `Classes` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Classes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Classes" DROP COLUMN "classId",
DROP COLUMN "name",
ADD COLUMN     "classCode" TEXT,
ADD COLUMN     "classname" TEXT;
