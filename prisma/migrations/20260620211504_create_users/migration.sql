-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('COURIER', 'LOGISTICSSUPPORT');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "documentID" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'COURIER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_documentID_key" ON "users"("documentID");
