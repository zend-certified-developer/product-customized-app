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
     console.log("FULL URL =", window.location.href);
  console.log("SEARCH =", window.location.search);
    const params =
      new URLSearchParams(
        window.location.search
      );
 console.log("productId =", params.get("productId"));
  console.log("variantId =", params.get("variantId"));
  console.log("shopUrl =", params.get("shopUrl"));
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

  // if (!productId) {
  //   return <div>Loading...</div>;
  // }
  return (
  <>
    <h1>Designer Route Loaded</h1>

    <p>productId = {String(productId)}</p>
    <p>variantId = {String(variantId)}</p>
    <p>shopUrl = {String(shopUrl)}</p>

    <DesignerClient
      productId={productId}
      variantId={variantId}
      shopUrl={shopUrl}
    />
  </>
);
}