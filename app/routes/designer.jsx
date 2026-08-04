

import { useEffect, useState } from "react";
import DesignerClient from "../components/DesignerClient";

export default function Designer() {
  const [productId, setProductId] =
    useState(null);

  const [variantId, setVariantId] =
    useState(null);

  const [shopUrl, setShopUrl] =
    useState("");
console.log("shopUrl", shopUrl);
console.log("variantId", variantId);
  useEffect(() => {
    const params =
      new URLSearchParams(
        window.location.search
      );

    setProductId(
      params.get("productId")
    );

    setVariantId(
      params.get("variantId")
    );

    setShopUrl(
      params.get("shopUrl")
    );
  }, []);

  if (!productId) {
    return <div>Loading...</div>;
  }

  return (
    <DesignerClient
      productId={productId}
      variantId={variantId}
      shopUrl={shopUrl}
    />
  );
}