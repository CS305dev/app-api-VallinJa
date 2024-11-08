/*
  Warnings:

  - You are about to drop the column `classId` on the `Enrollment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentId,calendarId]` on the table `Enrollment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_classId_fkey";

-- DropIndex
DROP INDEX "Enrollment_studentId_calendarId_classId_key";

-- AlterTable
ALTER TABLE "Enrollment" DROP COLUMN "classId";

-- CreateTable
CREATE TABLE "EnrollmentClasses" (
    "id" SERIAL NOT NULL,
    "enrollmentId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,

    CONSTRAINT "EnrollmentClasses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EnrollmentClasses_enrollmentId_classId_key" ON "EnrollmentClasses"("enrollmentId", "classId");

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_studentId_calendarId_key" ON "Enrollment"("studentId", "calendarId");

-- AddForeignKey
ALTER TABLE "EnrollmentClasses" ADD CONSTRAINT "EnrollmentClasses_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnrollmentClasses" ADD CONSTRAINT "EnrollmentClasses_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
