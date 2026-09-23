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
    Setting up the customizer takes two steps:
  </p>

  <h3>Step 1: Add the app block to your theme (once)</h3>
  <ol>
    <li>Go to <strong>Online Store → Themes</strong> in your Shopify admin.</li>
    <li>Click <strong>Customize</strong> on your live theme.</li>
    <li>Navigate to a <strong>Product page</strong> in the theme editor.</li>
    <li>Click <strong>Add block</strong> inside the product information section.</li>
    <li>Select <strong>Product Customizer</strong> from the app blocks list.</li>
    <li>Click <strong>Save</strong> in the top right corner.</li>
  </ol>

  <h3>Step 2: Choose which products can be customized</h3>
  <ol>
    <li>Go to <Link to="/app/products">Products Page</Link> in this app.</li>
    <li>Select the product(s) you want customers to be able to customize.</li>
    <li>Then by help of 'Edit' button on product you can configure design areas(like front,back.etc) and image accordingly for each product.</li>
  </ol>

  <p>
    The "Customize Product" button will only appear on the storefront
    for products you've enabled in Step 2.
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