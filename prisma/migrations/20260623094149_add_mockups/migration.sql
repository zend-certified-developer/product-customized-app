/*
  Warnings:

  - Made the column `image` on table `CustomizableProduct` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `CustomizableProduct` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CustomizableProduct" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "blackFront" TEXT,
    "blackBack" TEXT,
    "blackLeft" TEXT,
    "blackRight" TEXT,
    "whiteFront" TEXT,
    "whiteBack" TEXT,
    "whiteLeft" TEXT,
    "whiteRight" TEXT,
    "redFront" TEXT,
    "redBack" TEXT,
    "redLeft" TEXT,
    "redRight" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_CustomizableProduct" ("createdAt", "id", "image", "price", "productId", "title") SELECT "createdAt", "id", "image", "price", "productId", "title" FROM "CustomizableProduct";
DROP TABLE "CustomizableProduct";
ALTER TABLE "new_CustomizableProduct" RENAME TO "CustomizableProduct";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
