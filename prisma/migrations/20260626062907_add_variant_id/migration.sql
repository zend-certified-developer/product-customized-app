/*
  Warnings:

  - You are about to drop the column `blackBack` on the `CustomizableProduct` table. All the data in the column will be lost.
  - You are about to drop the column `blackFront` on the `CustomizableProduct` table. All the data in the column will be lost.
  - You are about to drop the column `blackLeft` on the `CustomizableProduct` table. All the data in the column will be lost.
  - You are about to drop the column `blackRight` on the `CustomizableProduct` table. All the data in the column will be lost.
  - You are about to drop the column `redBack` on the `CustomizableProduct` table. All the data in the column will be lost.
  - You are about to drop the column `redFront` on the `CustomizableProduct` table. All the data in the column will be lost.
  - You are about to drop the column `redLeft` on the `CustomizableProduct` table. All the data in the column will be lost.
  - You are about to drop the column `redRight` on the `CustomizableProduct` table. All the data in the column will be lost.
  - You are about to drop the column `whiteBack` on the `CustomizableProduct` table. All the data in the column will be lost.
  - You are about to drop the column `whiteFront` on the `CustomizableProduct` table. All the data in the column will be lost.
  - You are about to drop the column `whiteLeft` on the `CustomizableProduct` table. All the data in the column will be lost.
  - You are about to drop the column `whiteRight` on the `CustomizableProduct` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "ProductColor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" TEXT NOT NULL,
    "variantId" TEXT,
    "colorName" TEXT NOT NULL,
    "colorCode" TEXT NOT NULL,
    "frontEnabled" BOOLEAN NOT NULL DEFAULT true,
    "backEnabled" BOOLEAN NOT NULL DEFAULT true,
    "leftEnabled" BOOLEAN NOT NULL DEFAULT false,
    "rightEnabled" BOOLEAN NOT NULL DEFAULT false,
    "frontImage" TEXT,
    "backImage" TEXT,
    "leftImage" TEXT,
    "rightImage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CustomizableProduct" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_CustomizableProduct" ("createdAt", "id", "image", "price", "productId", "title") SELECT "createdAt", "id", "image", "price", "productId", "title" FROM "CustomizableProduct";
DROP TABLE "CustomizableProduct";
ALTER TABLE "new_CustomizableProduct" RENAME TO "CustomizableProduct";
CREATE UNIQUE INDEX "CustomizableProduct_productId_key" ON "CustomizableProduct"("productId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
