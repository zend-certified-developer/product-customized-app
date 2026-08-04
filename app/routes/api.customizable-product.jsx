import prisma from "../db.server";

export async function loader({ request }) {
  const url = new URL(request.url);

  const productId =
    url.searchParams.get("productId");

  const shop =
    url.searchParams.get("shop");
  console.log("SHOP =", shop);

  const settings =
    await prisma.appSettings.findUnique({
      where: {
        shop,
      },
    });

  console.log("SETTINGS =", settings);

  if (!settings?.appEnabled) {
    return Response.json({
      customizable: false,
    });
  }

  const product =
    await prisma.customizableProduct.findFirst({
      where: {
        productId: `gid://shopify/Product/${productId}`,
      },
    });
  console.log("PRODUCT =", product);
  return new Response(
    JSON.stringify({
      customizable: !!product,
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}