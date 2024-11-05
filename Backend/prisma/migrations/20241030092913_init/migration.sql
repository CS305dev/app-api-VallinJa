/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `program` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the `Courses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Grades` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Instructors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Schedule` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Courses" DROP CONSTRAINT "Courses_instructorId_fkey";

-- DropForeignKey
ALTER TABLE "Grades" DROP CONSTRAINT "Grades_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Grades" DROP CONSTRAINT "Grades_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_studentId_fkey";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "phoneNumber",
DROP COLUMN "program",
DROP COLUMN "year",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "contact" TEXT,
ADD COLUMN     "dateofbirth" TEXT,
ADD COLUMN     "enroll" TEXT;

-- DropTable
DROP TABLE "Courses";

-- DropTable
DROP TABLE "Grades";

-- DropTable
DROP TABLE "Instructors";

-- DropTable
DROP TABLE "Schedule";
