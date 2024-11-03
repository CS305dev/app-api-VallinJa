-- CreateTable
CREATE TABLE "Calendar" (
    "id" SERIAL NOT NULL,
    "semester" TEXT,
    "academicyear" TEXT,

    CONSTRAINT "Calendar_pkey" PRIMARY KEY ("id")
);
