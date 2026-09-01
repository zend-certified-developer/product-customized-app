import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { shop, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  // This app doesn't store customer personal data (only shop-level
  // product customization settings), so there's no data to return here.

  return new Response();
};