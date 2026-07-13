-- CreateEnum
CREATE TYPE "ShipmentStatus" AS ENUM ('WAITING', 'PICKED_UP', 'DELIVERED', 'RETURNED');

-- CreateTable
CREATE TABLE "shipments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "address_number" INTEGER NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "status" "ShipmentStatus" NOT NULL DEFAULT 'WAITING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "picked_up_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "delivered_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "returned_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "delivery_proof_id" TEXT,
    "recipientId" TEXT NOT NULL,
    "courierId" TEXT,

    CONSTRAINT "shipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery_proofs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "delivery_proofs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shipments_delivery_proof_id_key" ON "shipments"("delivery_proof_id");

-- CreateIndex
CREATE UNIQUE INDEX "shipments_recipientId_key" ON "shipments"("recipientId");

-- CreateIndex
CREATE UNIQUE INDEX "shipments_courierId_key" ON "shipments"("courierId");

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_delivery_proof_id_fkey" FOREIGN KEY ("delivery_proof_id") REFERENCES "delivery_proofs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_courierId_fkey" FOREIGN KEY ("courierId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
