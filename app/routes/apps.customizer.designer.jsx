// import DesignerClient from "../components/DesignerClient";

// export default function Designer() {
//   return <DesignerClient />;
// }
import { useLoaderData } from "react-router";
import DesignerClient from "../components/DesignerClient";

export async function loader({ request }) {
  const url = new URL(request.url);

  return {
    productId: url.searchParams.get("productId"),
    variantId: url.searchParams.get("variantId"),
    shopUrl: url.searchParams.get("shopUrl"),
  };
}

export default function Designer() {
  const { productId, variantId, shopUrl } = useLoaderData();

  return (
    <DesignerClient
      productId={productId}
      variantId={variantId}
      shopUrl={shopUrl}
    />
  );
}