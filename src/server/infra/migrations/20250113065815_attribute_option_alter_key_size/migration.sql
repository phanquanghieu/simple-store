/*
  Warnings:

  - You are about to alter the column `key` on the `attribute` table. The data in that column could be lost. The data in that column will be cast from `VarChar(256)` to `VarChar(100)`.
  - You are about to alter the column `key` on the `attribute_option` table. The data in that column could be lost. The data in that column will be cast from `VarChar(256)` to `VarChar(201)`.

*/
-- AlterTable
ALTER TABLE "attribute" ALTER COLUMN "key" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "attribute_option" ALTER COLUMN "key" SET DATA TYPE VARCHAR(201);
