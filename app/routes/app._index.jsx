import { authenticate } from "../shopify.server";
import "../dashboard.css";
import { useLoaderData } from "react-router";

import prisma from "../db.server";
import { Link } from "react-router";

export const loader = async ({ request }) => {
  const { session } =
    await authenticate.admin(request);

  const products =
    await prisma.customizableProduct.findMany();

  const settings =
    await prisma.appSettings.findUnique({
      where: {
        shop: session.shop,
      },
    });

  return {
    totalProducts: products.length,
    appEnabled:
      settings?.appEnabled ?? true,
    shop: session.shop,
  };
};
export default function Index() {
  const {
  totalProducts,
  appEnabled,
  shop,
} = useLoaderData();
  return (
    <div className="dashboard">

      <div className="hero">
  <h1>🎨 Welcome to Product Customizer</h1>

  <p>
    Manage customizable products and provide
    your customers with a personalized shopping
    experience.
  </p>
   <p className="shop-name">
    Store: {shop}
  </p>
</div>

      <div className="stats">

        <div className="card blue">
  <h2>{appEnabled ? "✓" : "✕"}</h2>
  <p>
    {appEnabled
      ? "App Active"
      : "App Disabled"}
  </p>
</div>

        <div className="card green">
          <h2>☁</h2>
          <p>Cloudinary Connected</p>
        </div>

        <div className="card orange">
  <h2>{totalProducts}</h2>
  <p>Total Products</p>
</div>
<div className="card purple">
  <h2>🎨</h2>
  <p>
    {appEnabled
      ? "Customizer Enabled"
      : "Customizer Disabled"}
  </p>
</div>
      </div>

      <div className="features">
        <h2>Features</h2>

        <ul>
          <li>✏️ Text customization</li>
          <li>🖼 Image upload support</li>
          <li>👕 Front design area</li>
          <li>🔄 Back design area</li>
          <li>💪 Sleeve customization</li>
          <li>☁ Cloudinary storage</li>
        </ul>
      </div>
<div className="features">
  <h2>Setup Guide</h2>

  <ol>
    <li>Open Products page.</li>
    <li>Enable customization.</li>
    <li>Upload images.</li>
    <li>Enable views.</li>
    <li>Save product.</li>
    <li>Test storefront.</li>
  </ol>
</div>
<div className="features">
  <h2>Add the Customizer Button to Your Storefront</h2>

  <p>
    For the "Customize Product" button to appear on your product
    pages, you need to add the app block to your theme once:
  </p>

  <ol>
    <li>Go to <strong>Online Store → Themes</strong> in your Shopify admin.</li>
    <li>Click <strong>Customize</strong> on your live theme.</li>
    <li>Navigate to a <strong>Product page</strong> in the theme editor.</li>
    <li>Click <strong>Add block</strong> inside the product information section.</li>
    <li>Select <strong>Product Customizer</strong> from the app blocks list.</li>
    <li>Click <strong>Save</strong> in the top right corner.</li>
  </ol>

  <p>
    Once added, the "Customize Product" button will automatically
    show up on any product you've enabled for customization above.
  </p>
</div>
      <div className="features">
        <h2>Quick Actions</h2>
<div className="actions">
  <Link to="/app/products" className="action-btn">
    Manage Products
  </Link>

  <Link to="/app/settings" className="action-btn">
    Settings
  </Link>
</div>
      </div>

    </div>
  );
}