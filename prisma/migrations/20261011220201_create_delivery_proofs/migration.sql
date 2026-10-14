/*
  Warnings:

  - You are about to drop the column `name` on the `delivery_proofs` table. All the data in the column will be lost.
  - Added the required column `title` to the `delivery_proofs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `delivery_proofs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "delivery_proofs" DROP COLUMN "name",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "url" TEXT NOT NULL;
