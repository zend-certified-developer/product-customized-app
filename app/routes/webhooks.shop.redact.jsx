import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  const { shop, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  // This webhook fires 48 hours after a store owner uninstalls the app,
  // requiring deletion of any remaining shop data.
  await db.session.deleteMany({ where: { shop } });
  await db.appSettings.deleteMany({ where: { shop } });

  return new Response();
};