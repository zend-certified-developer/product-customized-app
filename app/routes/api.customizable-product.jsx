import prisma from "../db.server";

export async function loader({ request }) {
  const url = new URL(request.url);

  const productId = url.searchParams.get("productId");
  const shop = url.searchParams.get("shop");

  console.log("SHOP =", shop);
  console.log("Incoming productId =", productId);
  if (!shop) {
  return Response.json(
    { customizable: false, error: "Missing shop parameter" },
    { status: 400 }
  );
}

  const settings = await prisma.appSettings.findUnique({
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

  const searchId = `gid://shopify/Product/${productId}`;
  console.log("Searching =", searchId);

  const product = await prisma.customizableProduct.findFirst({
    where: {
      productId: searchId,
    },
  });

  console.log("DB Result =", product);

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