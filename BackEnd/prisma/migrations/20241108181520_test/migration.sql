/*
  Warnings:

  - A unique constraint covering the columns `[studentId,calendarId]` on the table `Enrollment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_studentId_calendarId_key" ON "Enrollment"("studentId", "calendarId");
