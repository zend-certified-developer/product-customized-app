import prisma from "../db.server";

export async function loader({ request }) {
  const url = new URL(request.url);

  const productId =
    url.searchParams.get("productId");

  const gid =
    `gid://shopify/Product/${productId}`;

  const product =
    await prisma.customizableProduct.findFirst({
      where: {
        productId: gid,
      },
    });

  const colors =
    await prisma.productColor.findMany({
      where: {
        productId: gid,
      },
    });

  return Response.json({
    product,
    colors,
  });
}