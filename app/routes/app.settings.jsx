import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { Form, useLoaderData } from "react-router";
import { useState } from "react";
import "../dashboard.css";


export const loader = async ({ request }) => {
  const { session } =
    await authenticate.admin(request);

  const settings =
    await prisma.appSettings.findUnique({
      where: {
        shop: session.shop,
      },
    });

  return {
    enabled:
      settings?.appEnabled ?? true,
  };
};

export const action = async ({ request }) => {
  const { session } =
    await authenticate.admin(request);

  const formData =
    await request.formData();

  await prisma.appSettings.upsert({
    where: {
      shop: session.shop,
    },
    update: {
      appEnabled:
        formData.get("enabled") === "true",
    },
    create: {
      shop: session.shop,
      appEnabled:
        formData.get("enabled") === "true",
    },
  });

  return null;
};

export default function Settings() {
  const { enabled } =
    useLoaderData();
const [copied, setCopied] = useState(false);
  return (
    <s-page heading="Settings">

      
<div className="settings-grid">

  <div className="settings-card">
    <h2>⚙ App Status</h2>

    <Form method="post">
      <select
        name="enabled"
        defaultValue={String(enabled)}
      >
        <option value="true">
          Enabled
        </option>

        <option value="false">
          Disabled
        </option>
      </select>

      <br />
      <br />

      <button type="submit">
        Save Settings
      </button>
    </Form>

    <p>
      Current Status:
      <strong
        style={{
          color: enabled ? "green" : "red",
        }}
      >
        {enabled ? " Enabled" : " Disabled"}
      </strong>
    </p>
  </div>

  <div className="settings-card">
    <h2>☁ Cloudinary</h2>

    <p>
      Design images are uploaded
      automatically to Cloudinary.
    </p>

    <p>
      Status:
      <strong style={{ color: "green" }}>
        Connected
      </strong>
    </p>
  </div>

  <div className="settings-card">
    <h2>🎨 Design Areas</h2>

    <ul>
      <li>Front</li>
      <li>Back</li>
      <li>Left Sleeve</li>
      <li>Right Sleeve</li>
    </ul>
  </div>

  <div className="settings-card">
    <h2>ℹ App Information</h2>

    <p>Version: 1.0.0</p>

    <p>
      Product Customizer App
    </p>
  </div>
  <div className="settings-card">
  <h2>🛒 Make Design Links Clickable in Cart(Optional)</h2>

  <p>
    Shopify displays design image URLs in the cart by default.
  </p>

  <p>
    To show <strong>"View Design"</strong> clickable links instead of long URLs,
    replace the product properties loop in your cart template with the snippet below.
  </p>

  <textarea
    readOnly
    rows={18}
    style={{
      width: "100%",
      fontFamily: "monospace",
      fontSize: "13px",
      marginTop: "15px",
    }}
    value={`{% for property in item.properties %}

{% if property.first == 'Front'
   or property.first == 'Back'
   or property.first == 'Left'
   or property.first == 'Right' %}

<p>
  <strong>{{ property.first }}:</strong>
  <a href="{{ property.last }}" target="_blank">
    View Design
  </a>
</p>

{% else %}

<p>
  <strong>{{ property.first }}:</strong>
  {{ property.last }}
</p>

{% endif %}

{% endfor %}`}
  />

  <br />
  <br />

  <button
  type="button"
  onClick={async () => {
    await navigator.clipboard.writeText(`{% for property in item.properties %}

{% if property.first == 'Front'
   or property.first == 'Back'
   or property.first == 'Left'
   or property.first == 'Right' %}

<p>
  <strong>{{ property.first }}:</strong>
  <a href="{{ property.last }}" target="_blank">
    View Design
  </a>
</p>

{% else %}

<p>
  <strong>{{ property.first }}:</strong>
  {{ property.last }}
</p>

{% endif %}

{% endfor %}`);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }}
>
  {copied ? "✅ Copied!" : "📋 Copy Code"}
</button>
<div
  style={{
    background: "#f6f6f7",
    border: "1px solid #d9d9d9",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "16px",
    color: "#555",
    lineHeight: "1.5",
  }}
>
  💡 <strong>Optional:</strong> Your app works perfectly without this change.
  <br />
  This snippet only replaces long image URLs in the cart with clean
  <strong> "View Design"</strong> links.
</div>
  <br />
  <br />

  <div
    style={{
      background: "#f6f6f6",
      padding: "15px",
      borderRadius: "8px",
      fontSize: "14px",
      lineHeight: "1.8",
    }}
  >
    <strong>Installation:</strong>

    <ol style={{ marginTop: "10px" }}>
      <li>Go to <b>Online Store → Themes → Edit Code</b>.</li>
      <li>Open your cart template (cart-item.liquid or main-cart-items.liquid).</li>
      <li>Find the line:
        <pre>{`{% for property in item.properties %}`}</pre>
      </li>
      <li>Replace that entire properties loop with the copied snippet.</li>
      <li>Save the file.</li>
    </ol>
  </div>
</div>

</div>
    </s-page>
  );
}