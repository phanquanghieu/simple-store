/*
  Warnings:

  - You are about to drop the column `inventory_id` on the `product_variant` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "product_variant_inventory_id_key";

-- AlterTable
ALTER TABLE "product_variant" DROP COLUMN "inventory_id";
