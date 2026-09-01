import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { shop, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  // This app doesn't store any customer personal data, so there's
  // nothing to redact here.

  return new Response();
};