/*
  Warnings:

  - A unique constraint covering the columns `[variantId]` on the table `ProductColor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProductColor_variantId_key" ON "ProductColor"("variantId");
