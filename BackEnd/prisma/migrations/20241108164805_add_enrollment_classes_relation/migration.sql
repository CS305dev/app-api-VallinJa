/*
  Warnings:

  - You are about to drop the column `classId` on the `Enrollment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_classId_fkey";

-- DropIndex
DROP INDEX "Enrollment_studentId_calendarId_classId_key";

-- AlterTable
ALTER TABLE "Enrollment" DROP COLUMN "classId";

-- CreateTable
CREATE TABLE "EnrollmentClasses" (
    "enrollmentId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,

    CONSTRAINT "EnrollmentClasses_pkey" PRIMARY KEY ("enrollmentId","classId")
);

-- AddForeignKey
ALTER TABLE "EnrollmentClasses" ADD CONSTRAINT "EnrollmentClasses_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnrollmentClasses" ADD CONSTRAINT "EnrollmentClasses_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
