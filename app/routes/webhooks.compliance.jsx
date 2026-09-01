import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  const { shop, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  switch (topic) {
    case "customers/data_request":
      // App doesn't store customer personal data — nothing to return.
      break;
    case "customers/redact":
      // App doesn't store customer personal data — nothing to redact.
      break;
    case "shop/redact":
      await db.session.deleteMany({ where: { shop } });
      await db.appSettings.deleteMany({ where: { shop } });
      break;
  }

  return new Response();
};