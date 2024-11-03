-- CreateTable
CREATE TABLE "Classes" (
    "id" SERIAL NOT NULL,
    "classId" TEXT,
    "name" TEXT,
    "description" TEXT,

    CONSTRAINT "Classes_pkey" PRIMARY KEY ("id")
);
