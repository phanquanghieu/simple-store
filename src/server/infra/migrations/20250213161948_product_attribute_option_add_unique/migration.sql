/*
  Warnings:

  - A unique constraint covering the columns `[product_id,attribute_id]` on the table `product_attribute` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[product_id,attribute_option_id]` on the table `product_attribute_option` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "product_attribute_product_id_attribute_id_key" ON "product_attribute"("product_id", "attribute_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_attribute_option_product_id_attribute_option_id_key" ON "product_attribute_option"("product_id", "attribute_option_id");
