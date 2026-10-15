ALTER TABLE "CustomizableProduct" ADD COLUMN "shop" TEXT NOT NULL DEFAULT '';
ALTER TABLE "ProductColor" ADD COLUMN "shop" TEXT NOT NULL DEFAULT '';

CREATE INDEX "CustomizableProduct_shop_idx" ON "CustomizableProduct"("shop");
CREATE INDEX "ProductColor_shop_idx" ON "ProductColor"("shop");

-- apne products ko apne shop se jodo (aur products ho to IN list mein add karo)
UPDATE "CustomizableProduct" SET "shop" = 'quickstart-1a38cf4f.myshopify.com'
WHERE "productId" IN ('gid://shopify/Product/10622461018404');

UPDATE "ProductColor" SET "shop" = 'quickstart-1a38cf4f.myshopify.com'
WHERE "productId" IN ('gid://shopify/Product/10622461018404');