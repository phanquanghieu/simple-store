/*
  Warnings:

  - A unique constraint covering the columns `[sku]` on the table `product` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "product" ADD COLUMN     "cost" DECIMAL(20,2),
ADD COLUMN     "sku" VARCHAR(100);

-- CreateIndex
CREATE UNIQUE INDEX "product_sku_key" ON "product"("sku");
