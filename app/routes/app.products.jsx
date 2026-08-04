import { useState } from "react";
import { useFetcher, useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useNavigate } from "react-router";
import "../dashboard.css";

export async function loader({ request }) {
  await authenticate.admin(request);

 const products =
  await prisma.customizableProduct.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

return {
  products,
};
}

export async function action({ request }) {
  await authenticate.admin(request);

  const formData =
    await request.formData();

  const productsData =
    formData.get("products");

   
  const settingsData =
    formData.get("settings");
    const deleteProductId =
  formData.get("deleteProductId");

  if (productsData) {
    const products =
      JSON.parse(productsData);

    for (const product of products) {
      await prisma.customizableProduct.upsert({
        where: {
          productId: product.id,
        },

        update: {
          title: product.title,

          image:
            product.images?.[0]
              ?.originalSrc || "",

          price:
            product.variants?.[0]
              ?.price || "",
                variantData: JSON.stringify(
    product.variants
  ),
        },

        create: {
          productId: product.id,

          title: product.title,

          image:
            product.images?.[0]
              ?.originalSrc || "",

          price:
            product.variants?.[0]
              ?.price || "",
                variantData: JSON.stringify(
    product.variants
  ),
        },
      });
    }
  }

  if (settingsData) {
    const settings =
      JSON.parse(settingsData);

    for (const productId in settings) {
      await prisma.customizableProduct.update({
        where: {
          productId,
        },

        data: {
          enabled:
            settings[productId]
              ?.enabled,
   
        },
        
      });
    }
  }

if (deleteProductId) {
  await prisma.productColor.deleteMany({
    where: {
      productId: deleteProductId,
    },
  });

  await prisma.customizableProduct.delete({
    where: {
      productId: deleteProductId,
    },
  });

  return {
    deleted: true,
  };
}
  return {
  saved: true,
};
}

export default function Products() {
  const fetcher = useFetcher();
  const shopify = useAppBridge();
const navigate = useNavigate();
const [selectedProducts, setSelectedProducts] =
  useState([]);

const [settings, setSettings] =
  useState({});
 
const { products } = useLoaderData();

  
    const openProductPicker =
  async () => {
    const products =
      await shopify.resourcePicker({
        type: "product",
        multiple: true,
      });

    if (products) {
    
      setSelectedProducts(products);
    }
  };
 
  return (
    <s-page heading="Products">
      <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  }}
>
  <h2>Manage Customizable Products</h2>

  <s-button onClick={openProductPicker}>
    Select Products
  </s-button>
</div>
    {products.length === 0 && (
  <div className="empty-state">

    <h2>📦 No Products Added</h2>

    <p>
      Select products from Shopify to start
      customization.
    </p>


  </div>
)}

<br />
<br />

{selectedProducts.length > 0 && (
  <s-button
    loading={
      fetcher.state ===
      "submitting"
    }
    onClick={() =>
fetcher.submit(
{
  products: JSON.stringify(
    selectedProducts
  ),

  settings: JSON.stringify(
    settings
  ),


},
{
  method: "POST",
}
)
    }
  >
    Save Products
  </s-button>
)}

<hr />

{products.map((product) => {
  
  return (
    <div className="variant-card"
      key={product.id}
      style={{
        border: "1px solid #ddd",
        padding: "20px",
        marginBottom: "20px",
        borderRadius: "8px",
      }}
    >
      <div className="product-header">

  <img
    src={product.image}
    width="100"
    style={{
      borderRadius: "10px",
    }}
  />

  <div>
    <h2>{product.title}</h2>

    <p>₹{product.price}</p>

  </div>

</div>

    
<div
  style={{
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  }}
>
  <button
    onClick={() =>
      navigate(
        `/app/product/${product.productId.split("/").pop()}`
      )
    }
  >
    Edit
  </button>

  <s-button
    tone="critical"
    onClick={() =>
      fetcher.submit(
        {
          deleteProductId: product.productId,
        },
        {
          method: "POST",
        }
      )
    }
  >
    Delete Product
  </s-button>
</div>

    </div>
  );
})}



      {fetcher.data?.saved && (
  <p
    style={{
      color: "green",
      marginTop: "20px",
    }}
  >
    Product saved successfully.
  </p>
)}

{fetcher.data?.deleted && (
  <p
    style={{
      color: "red",
      marginTop: "20px",
    }}
  >
    Product deleted successfully.
  </p>
)}
  
    </s-page>
  );
}