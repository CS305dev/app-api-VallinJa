/*
  Warnings:

  - You are about to drop the `EnrollmentClasses` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[studentId,calendarId,classId]` on the table `Enrollment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `classId` to the `Enrollment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EnrollmentClasses" DROP CONSTRAINT "EnrollmentClasses_classId_fkey";

-- DropForeignKey
ALTER TABLE "EnrollmentClasses" DROP CONSTRAINT "EnrollmentClasses_enrollmentId_fkey";

-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN     "classId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "EnrollmentClasses";

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_studentId_calendarId_classId_key" ON "Enrollment"("studentId", "calendarId", "classId");

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
