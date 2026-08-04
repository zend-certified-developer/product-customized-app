-- CreateTable
CREATE TABLE "CustomOrder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shopifyOrderId" TEXT NOT NULL,
    "orderName" TEXT NOT NULL,
    "customerName" TEXT,
    "createdAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CustomOrderItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderId" INTEGER NOT NULL,
    "productTitle" TEXT NOT NULL,
    "variantTitle" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "frontImage" TEXT,
    "backImage" TEXT,
    "leftImage" TEXT,
    "rightImage" TEXT,
    CONSTRAINT "CustomOrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "CustomOrder" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomOrder_shopifyOrderId_key" ON "CustomOrder"("shopifyOrderId");
