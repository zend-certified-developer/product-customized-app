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
    "frontX" INTEGER NOT NULL DEFAULT 170,
    "frontY" INTEGER NOT NULL DEFAULT 140,
    "frontWidth" INTEGER NOT NULL DEFAULT 160,
    "frontHeight" INTEGER NOT NULL DEFAULT 180,
    "backX" INTEGER NOT NULL DEFAULT 170,
    "backY" INTEGER NOT NULL DEFAULT 140,
    "backWidth" INTEGER NOT NULL DEFAULT 160,
    "backHeight" INTEGER NOT NULL DEFAULT 180,
    "leftX" INTEGER NOT NULL DEFAULT 170,
    "leftY" INTEGER NOT NULL DEFAULT 140,
    "leftWidth" INTEGER NOT NULL DEFAULT 160,
    "leftHeight" INTEGER NOT NULL DEFAULT 180,
    "rightX" INTEGER NOT NULL DEFAULT 170,
    "rightY" INTEGER NOT NULL DEFAULT 140,
    "rightWidth" INTEGER NOT NULL DEFAULT 160,
    "rightHeight" INTEGER NOT NULL DEFAULT 180,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_ProductColor" ("backEnabled", "backImage", "colorCode", "colorName", "createdAt", "frontEnabled", "frontImage", "id", "leftEnabled", "leftImage", "productId", "rightEnabled", "rightImage", "variantId") SELECT "backEnabled", "backImage", "colorCode", "colorName", "createdAt", "frontEnabled", "frontImage", "id", "leftEnabled", "leftImage", "productId", "rightEnabled", "rightImage", "variantId" FROM "ProductColor";
DROP TABLE "ProductColor";
ALTER TABLE "new_ProductColor" RENAME TO "ProductColor";
CREATE UNIQUE INDEX "ProductColor_variantId_key" ON "ProductColor"("variantId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
