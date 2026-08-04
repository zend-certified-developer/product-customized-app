/*
  Warnings:

  - Made the column `variantId` on table `ProductColor` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductColor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
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
INSERT INTO "new_ProductColor" ("backEnabled", "backImage", "colorCode", "colorName", "createdAt", "frontEnabled", "frontImage", "id", "leftEnabled", "leftImage", "productId", "rightEnabled", "rightImage", "variantId") SELECT "backEnabled", "backImage", "colorCode", "colorName", "createdAt", "frontEnabled", "frontImage", "id", "leftEnabled", "leftImage", "productId", "rightEnabled", "rightImage", "variantId" FROM "ProductColor";
DROP TABLE "ProductColor";
ALTER TABLE "new_ProductColor" RENAME TO "ProductColor";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
