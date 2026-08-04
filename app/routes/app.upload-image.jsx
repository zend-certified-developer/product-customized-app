import { authenticate } from "../shopify.server";

export async function action({ request }) {
  const { admin } = await authenticate.admin(request);

console.log(admin);
  const formData = await request.formData();

  const file = formData.get("file");

  console.log(file);

  return Response.json({
    success: true,
  });
}