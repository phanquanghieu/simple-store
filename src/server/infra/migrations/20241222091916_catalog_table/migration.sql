/*
  Warnings:

  - You are about to drop the column `stock` on the `product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_variants` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "E_PRODUCT_STATUS" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "E_ATTRIBUTE_TYPE" AS ENUM ('TEXT', 'COLOR', 'BOOLEAN');

-- CreateEnum
CREATE TYPE "E_FILE_TYPE" AS ENUM ('IMAGE', 'VIDEO', 'OTHER');

-- AlterTable
ALTER TABLE "product" DROP COLUMN "stock",
ADD COLUMN     "compare_at_price" DECIMAL(20,2),
ADD COLUMN     "slug" VARCHAR(256) NOT NULL,
ADD COLUMN     "status" "E_PRODUCT_STATUS" NOT NULL,
ADD COLUMN     "total_variants" INTEGER NOT NULL,
ADD COLUMN     "variant_attribute_1_id" UUID,
ADD COLUMN     "variant_attribute_2_id" UUID,
ADD COLUMN     "variant_attribute_3_id" UUID;

-- CreateTable
CREATE TABLE "product_variant" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "inventory_id" UUID NOT NULL,
    "variant_attribute_option_1_id" UUID,
    "variant_attribute_option_2_id" UUID,
    "variant_attribute_option_3_id" UUID,
    "sku" VARCHAR(100),
    "price" DECIMAL(20,2) NOT NULL,
    "compare_at_price" DECIMAL(20,2),
    "cost" DECIMAL(20,2),
    "position" SMALLINT NOT NULL DEFAULT 1,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_variant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_attribute" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "attribute_id" UUID NOT NULL,
    "position" SMALLINT NOT NULL DEFAULT 1,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_attribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_attribute_option" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "product_attribute_id" UUID NOT NULL,
    "attribute_option_id" UUID NOT NULL,
    "position" SMALLINT NOT NULL DEFAULT 1,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_attribute_option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory" (
    "id" UUID NOT NULL,
    "product_variant_id" UUID NOT NULL,
    "sku" VARCHAR(100),
    "quantity_available" INTEGER NOT NULL DEFAULT 0,
    "quantity_unavailable" INTEGER NOT NULL DEFAULT 0,
    "quantity_committed" INTEGER NOT NULL DEFAULT 0,
    "quantity_total" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_history" (
    "id" UUID NOT NULL,
    "inventory_id" UUID NOT NULL,
    "quantity_available" INTEGER NOT NULL DEFAULT 0,
    "quantity_available_delta" INTEGER NOT NULL DEFAULT 0,
    "quantity_unavailable" INTEGER NOT NULL DEFAULT 0,
    "quantity_unavailable_delta" INTEGER NOT NULL DEFAULT 0,
    "quantity_committed" INTEGER NOT NULL DEFAULT 0,
    "quantity_committed_delta" INTEGER NOT NULL DEFAULT 0,
    "quantity_total" INTEGER NOT NULL DEFAULT 0,
    "quantity_total_delta" INTEGER NOT NULL DEFAULT 0,
    "reason" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attribute" (
    "id" UUID NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "key" VARCHAR(256) NOT NULL,
    "description" TEXT NOT NULL,
    "type" "E_ATTRIBUTE_TYPE" NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attribute_option" (
    "id" UUID NOT NULL,
    "attribute_id" UUID NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "key" VARCHAR(256) NOT NULL,
    "value" VARCHAR(256) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attribute_option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "E_FILE_TYPE" NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "alt" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mime_type" VARCHAR(32) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_file" (
    "product_id" UUID NOT NULL,
    "file_id" UUID NOT NULL,
    "position" SMALLINT NOT NULL DEFAULT 1,

    CONSTRAINT "product_file_pkey" PRIMARY KEY ("product_id","file_id")
);

-- CreateTable
CREATE TABLE "_category_to_attribute" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_category_to_attribute_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_variant_inventory_id_key" ON "product_variant"("inventory_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_variant_sku_key" ON "product_variant"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_sku_key" ON "inventory"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "attribute_key_key" ON "attribute"("key");

-- CreateIndex
CREATE UNIQUE INDEX "attribute_option_key_key" ON "attribute_option"("key");

-- CreateIndex
CREATE INDEX "_category_to_attribute_B_index" ON "_category_to_attribute"("B");

-- CreateIndex
CREATE UNIQUE INDEX "product_slug_key" ON "product"("slug");

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_variant_attribute_1_id_fkey" FOREIGN KEY ("variant_attribute_1_id") REFERENCES "attribute"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_variant_attribute_2_id_fkey" FOREIGN KEY ("variant_attribute_2_id") REFERENCES "attribute"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_variant_attribute_3_id_fkey" FOREIGN KEY ("variant_attribute_3_id") REFERENCES "attribute"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant" ADD CONSTRAINT "product_variant_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant" ADD CONSTRAINT "product_variant_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant" ADD CONSTRAINT "product_variant_variant_attribute_option_1_id_fkey" FOREIGN KEY ("variant_attribute_option_1_id") REFERENCES "attribute_option"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant" ADD CONSTRAINT "product_variant_variant_attribute_option_2_id_fkey" FOREIGN KEY ("variant_attribute_option_2_id") REFERENCES "attribute_option"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant" ADD CONSTRAINT "product_variant_variant_attribute_option_3_id_fkey" FOREIGN KEY ("variant_attribute_option_3_id") REFERENCES "attribute_option"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_attribute" ADD CONSTRAINT "product_attribute_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_attribute" ADD CONSTRAINT "product_attribute_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "attribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_attribute_option" ADD CONSTRAINT "product_attribute_option_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_attribute_option" ADD CONSTRAINT "product_attribute_option_product_attribute_id_fkey" FOREIGN KEY ("product_attribute_id") REFERENCES "product_attribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_attribute_option" ADD CONSTRAINT "product_attribute_option_attribute_option_id_fkey" FOREIGN KEY ("attribute_option_id") REFERENCES "attribute_option"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_history" ADD CONSTRAINT "inventory_history_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attribute_option" ADD CONSTRAINT "attribute_option_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "attribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_file" ADD CONSTRAINT "product_file_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_file" ADD CONSTRAINT "product_file_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "file"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_category_to_attribute" ADD CONSTRAINT "_category_to_attribute_A_fkey" FOREIGN KEY ("A") REFERENCES "attribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_category_to_attribute" ADD CONSTRAINT "_category_to_attribute_B_fkey" FOREIGN KEY ("B") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
