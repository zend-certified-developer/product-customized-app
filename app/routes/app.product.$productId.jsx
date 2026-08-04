import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { Stage, Layer, Rect, Transformer  } from "react-konva";
import { useLoaderData, useFetcher } from "react-router";
import { useState, useEffect, useRef } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import "../dashboard.css";

export async function loader({ request, params }) {
  await authenticate.admin(request);

  const productId =
    `gid://shopify/Product/${params.productId}`;

  const product =
    await prisma.customizableProduct.findUnique({
      where: {
        productId,
      },
    });

  const productColors =
    await prisma.productColor.findMany({
      where: {
        productId,
      },
    });
console.log("PRODUCT COLORS");
console.log(JSON.stringify(productColors, null, 2));
  const variants = JSON.parse(
  product.variantData || "[]"
);

return {
  product,
  productColors,
  variants,
};
}

export async function action({ request }) {
  await authenticate.admin(request);

  const formData = await request.formData();

  const colorData = formData.get("colorData");

  if (colorData) {
    const colors = JSON.parse(colorData);

     console.log("========== COLORS RECEIVED ==========");
  console.log(JSON.stringify(colors, null, 2));
    for (const color of colors) {
        
       console.log("Saving variant:", color.variantId);
  
const result = await prisma.productColor.upsert({
      where: {
        variantId: color.variantId,
      },
        update: {
          colorName: color.colorName,
          colorCode: color.colorCode,

          frontEnabled: color.frontEnabled,
          backEnabled: color.backEnabled,
          leftEnabled: color.leftEnabled,
          rightEnabled: color.rightEnabled,

          frontImage: color.frontImage,
          backImage: color.backImage,
          leftImage: color.leftImage,
          rightImage: color.rightImage,

          frontX: color.frontX,
          frontY: color.frontY,
          frontWidth: color.frontWidth,
          frontHeight: color.frontHeight,

          backX: color.backX,
          backY: color.backY,
          backWidth: color.backWidth,
          backHeight: color.backHeight,

          leftX: color.leftX,
          leftY: color.leftY,
          leftWidth: color.leftWidth,
          leftHeight: color.leftHeight,

          rightX: color.rightX,
          rightY: color.rightY,
          rightWidth: color.rightWidth,
          rightHeight: color.rightHeight,
        },

        create: color,
      });
       console.log("Saved Result:");
    console.log(result);
    }
  }

  return {
    saved: true,
  };
}

export default function ProductEdit() {
 const {
  product,
  productColors,
  variants,
} = useLoaderData();
const [printAreaModal, setPrintAreaModal] = useState(false);
const [uploadingSide, setUploadingSide] = useState("");

const [editingSide, setEditingSide] = useState("front");

const [selectedVariant, setSelectedVariant] = useState(null);

const [printArea, setPrintArea] = useState({
  x: 170,
  y: 140,
  width: 160,
  height: 180,
});
const rectRef = useRef();

const transformerRef = useRef();
  const fetcher = useFetcher();
  const shopify = useAppBridge();
  const initialSettings = {};

productColors.forEach((color) => {
  initialSettings[color.variantId] = {
    productId: color.productId,
    variantId: color.variantId,
    colorName: color.colorName,
    colorCode: color.colorCode,

    frontEnabled: color.frontEnabled,
    backEnabled: color.backEnabled,
    leftEnabled: color.leftEnabled,
    rightEnabled: color.rightEnabled,

    frontImage: color.frontImage || "",
    backImage: color.backImage || "",
    leftImage: color.leftImage || "",
    rightImage: color.rightImage || "",

    frontX: color.frontX,
    frontY: color.frontY,
    frontWidth: color.frontWidth,
    frontHeight: color.frontHeight,

    backX: color.backX,
    backY: color.backY,
    backWidth: color.backWidth,
    backHeight: color.backHeight,

    leftX: color.leftX,
    leftY: color.leftY,
    leftWidth: color.leftWidth,
    leftHeight: color.leftHeight,

    rightX: color.rightX,
    rightY: color.rightY,
    rightWidth: color.rightWidth,
    rightHeight: color.rightHeight,
  };
});
console.log("INITIAL SETTINGS");
console.log(JSON.stringify(initialSettings, null, 2));
const modalImage =
  editingSide === "front"
    ? selectedVariant?.color?.frontImage
    : editingSide === "back"
    ? selectedVariant?.color?.backImage
    : editingSide === "left"
    ? selectedVariant?.color?.leftImage
    : selectedVariant?.color?.rightImage;

    const changeSide = (side) => {
  setEditingSide(side);

  const color = selectedVariant?.color;

  if (!color) return;

  setPrintArea({
    x: color[`${side}X`] ?? 170,
    y: color[`${side}Y`] ?? 140,
    width: color[`${side}Width`] ?? 160,
    height: color[`${side}Height`] ?? 180,
  });
};
const uploadImage = async (side, variant, product) => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;

    setUploadingSide(`${variant}-${side}`);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "designer");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/fuyksn9p/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
console.log("Cloudinary Response:", data);

if (!data.secure_url) {
  alert("Image upload failed");
  return;
}
    if (!data.secure_url) {
        setUploadingSide("");
      alert("Image upload failed");
      return;
    }

  setVariantSettings((prev) => ({
  ...prev,
  [variant.id]: {
    productId: prev[variant.id]?.productId ?? product.productId,
    variantId: prev[variant.id]?.variantId ?? variant.id,
    colorName: prev[variant.id]?.colorName ?? variant.title,
    colorCode: prev[variant.id]?.colorCode ?? "#000000",

    frontEnabled: prev[variant.id]?.frontEnabled ?? true,
    backEnabled: prev[variant.id]?.backEnabled ?? true,
    leftEnabled: prev[variant.id]?.leftEnabled ?? false,
    rightEnabled: prev[variant.id]?.rightEnabled ?? false,

    frontImage: prev[variant.id]?.frontImage ?? "",
    backImage: prev[variant.id]?.backImage ?? "",
    leftImage: prev[variant.id]?.leftImage ?? "",
    rightImage: prev[variant.id]?.rightImage ?? "",

    frontX: prev[variant.id]?.frontX ?? 170,
    frontY: prev[variant.id]?.frontY ?? 140,
    frontWidth: prev[variant.id]?.frontWidth ?? 160,
    frontHeight: prev[variant.id]?.frontHeight ?? 180,

    backX: prev[variant.id]?.backX ?? 170,
    backY: prev[variant.id]?.backY ?? 140,
    backWidth: prev[variant.id]?.backWidth ?? 160,
    backHeight: prev[variant.id]?.backHeight ?? 180,

    leftX: prev[variant.id]?.leftX ?? 170,
    leftY: prev[variant.id]?.leftY ?? 140,
    leftWidth: prev[variant.id]?.leftWidth ?? 160,
    leftHeight: prev[variant.id]?.leftHeight ?? 180,

    rightX: prev[variant.id]?.rightX ?? 170,
    rightY: prev[variant.id]?.rightY ?? 140,
    rightWidth: prev[variant.id]?.rightWidth ?? 160,
    rightHeight: prev[variant.id]?.rightHeight ?? 180,

    [`${side}Image`]: data.secure_url,
  },
}));  setUploadingSide("");
  };

  input.click();
};
useEffect(() => {
  if (!printAreaModal) return;

  const timer = setTimeout(() => {
    if (rectRef.current && transformerRef.current) {
      transformerRef.current.nodes([rectRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, 100);

  return () => clearTimeout(timer);
}, [printAreaModal]);
const [variantSettings, setVariantSettings] =
  useState(initialSettings);
useEffect(() => {
  console.log("VARIANT SETTINGS UPDATED");
  console.log(variantSettings);
}, [variantSettings]);
useEffect(() => {
  setVariantSettings(initialSettings);
}, [productColors]);

  return (
    <div style={{ padding: 30 }}>
      <h1>{product.title}</h1>
      <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  }}
>
  <button onClick={() => window.history.back()}>
    ← Back
  </button>

  <s-button
    loading={fetcher.state === "submitting"}
    onClick={() =>
      fetcher.submit(
        {
          colorData: JSON.stringify(
            Object.values(variantSettings)
          ),
        },
        {
          method: "POST",
        }
      )
    }
  >
    Save Changes
  </s-button>
</div>
      <h4>
  Colors ({variants.length})
</h4>

      {variants.map((variant) => {
 const data =
  variantSettings[variant.id] || {
    productId: product.productId,
    variantId: variant.id,
    colorName: variant.title,
    colorCode: "#000000",
    frontEnabled: true,
    backEnabled: true,
    leftEnabled: false,
    rightEnabled: false,
    frontImage: "",
    backImage: "",
    leftImage: "",
    rightImage: "",
    frontX: 170,
frontY: 140,
frontWidth: 160,
frontHeight: 180,

backX: 170,
backY: 140,
backWidth: 160,
backHeight: 180,

leftX: 170,
leftY: 140,
leftWidth: 160,
leftHeight: 180,

rightX: 170,
rightY: 140,
rightWidth: 160,
rightHeight: 180,
  };
  return (
    <div className="product-card"
      key={variant.id}
      style={{
        border: "1px solid #ddd",
        padding: "15px",
        marginBottom: "15px",
      }}
    >
      <h5>
  🎨 {variant.title}
</h5>
<div
  style={{
    display: "flex",
    gap: "10px",
    margin: "10px 0",
  }}
>
 
  <button
  onClick={() => {
const colorData = variantSettings[variant.id];
console.log(
  "OPENING",
  JSON.stringify(colorData, null, 2)
);
setSelectedVariant({
  product,
  variant,
  color: colorData,
});

const side =
  colorData?.frontEnabled
    ? "front"
    : colorData?.backEnabled
    ? "back"
    : colorData?.leftEnabled
    ? "left"
    : "right";

setEditingSide(side);

if (colorData) {
  setPrintArea({
    x: colorData[`${side}X`],
    y: colorData[`${side}Y`],
    width: colorData[`${side}Width`],
    height: colorData[`${side}Height`],
  });
}
  setPrintAreaModal(true);
}}
>
  Edit Print Area
</button>
</div>
 <label
  style={{
    display: "block",
    marginBottom: "5px",
    fontWeight: "600",
  }}
>
  Color
</label>
<input
  type="color"
  value={data.colorCode}
  onChange={(e) =>
    setVariantSettings((prev) => ({
  ...prev,
  [variant.id]: {
    ...prev[variant.id],
    productId: product.productId,
    variantId: variant.id,
    colorName: variant.title,
    colorCode: e.target.value,
  },
}))
  }
/> 

<br />
<div className="side-grid">
      <label>
  <input
    type="checkbox"
    checked={data.frontEnabled}
    onChange={(e) =>
      setVariantSettings((prev) => ({
        ...prev,
        [variant.id]: {
          ...data,
          productId: product.productId,
          variantId: variant.id,
          colorName: variant.title,
          frontEnabled: e.target.checked,
        },
      }))
    }
  />
  Front
</label>

{!data.frontImage ? (
  <button
   disabled={uploadingSide === `${variant.id}-front`}
    onClick={() => uploadImage("front", variant, product)}
  >
   {uploadingSide === `${variant.id}-front`
    ? "Uploading..."
    : "Select Front Image"}
  </button>
) : (
  <div style={{ marginTop: "10px" }}>
    <img
      src={data.frontImage}
      width={100}
      style={{
        borderRadius: "6px",
        border: "1px solid #ddd",
      }}
    />

    <div
      style={{
        display: "flex",
        gap: "10px",
        marginTop: "10px",
      }}
    >
      <button
       disabled={uploadingSide === `${variant.id}-front`}
        onClick={() =>
          uploadImage("front", variant, product)
        }
      >
         {uploadingSide === `${variant.id}-front`
    ? "Uploading..."
    : "Replace"}
      </button>

      <button
        onClick={() =>
          setVariantSettings((prev) => ({
            ...prev,
            [variant.id]: {
              ...prev[variant.id],
              frontImage: "",
            },
          }))
        }
      >
        Remove
      </button>
    </div>
  </div>
)}

<br /><br />
    <label>
  <input
    type="checkbox"
    checked={data.backEnabled}
    onChange={(e) =>
      setVariantSettings((prev) => ({
        ...prev,
        [variant.id]: {
          ...data,
          productId: product.productId,
          variantId: variant.id,
          colorName: variant.title,
          backEnabled: e.target.checked,
        },
      }))
    }
  />
  Back
</label>


{!data.backImage ? (
  <button
    disabled={uploadingSide === `${variant.id}-back`}
    onClick={() => uploadImage("back", variant, product)}
  >
    {uploadingSide === `${variant.id}-back`
      ? "Uploading..."
      : "Select Back Image"}
  </button>
) : (
  <div style={{ marginTop: "10px" }}>
    <img
      src={data.backImage}
      width={100}
      style={{
        borderRadius: "6px",
        border: "1px solid #ddd",
      }}
    />

    <div
      style={{
        display: "flex",
        gap: "10px",
        marginTop: "10px",
      }}
    >
      <button
        disabled={uploadingSide === `${variant.id}-back`}
        onClick={() =>
          uploadImage("back", variant, product)
        }
      >
        {uploadingSide === `${variant.id}-back`
          ? "Uploading..."
          : "Replace"}
      </button>

      <button
        onClick={() =>
          setVariantSettings((prev) => ({
            ...prev,
            [variant.id]: {
              ...prev[variant.id],
              backImage: "",
            },
          }))
        }
      >
        Remove
      </button>
    </div>
  </div>
)}
<br /><br />
    <label>
  <input
    type="checkbox"
    checked={data.leftEnabled}
    onChange={(e) =>
      setVariantSettings((prev) => ({
        ...prev,
        [variant.id]: {
          ...data,
          productId: product.productId,
          variantId: variant.id,
          colorName: variant.title,
          leftEnabled: e.target.checked,
        },
      }))
    }
  />
  Left
</label>


{!data.leftImage ? (
  <button
    disabled={uploadingSide === `${variant.id}-left`}
    onClick={() => uploadImage("left", variant, product)}
  >
    {uploadingSide === `${variant.id}-left`
      ? "Uploading..."
      : "Select Left Image"}
  </button>
) : (
  <div style={{ marginTop: "10px" }}>
    <img
      src={data.leftImage}
      width={100}
      style={{
        borderRadius: "6px",
        border: "1px solid #ddd",
      }}
    />

    <div
      style={{
        display: "flex",
        gap: "10px",
        marginTop: "10px",
      }}
    >
      <button
        disabled={uploadingSide === `${variant.id}-left`}
        onClick={() =>
          uploadImage("left", variant, product)
        }
      >
        {uploadingSide === `${variant.id}-left`
          ? "Uploading..."
          : "Replace"}
      </button>

      <button
        onClick={() =>
          setVariantSettings((prev) => ({
            ...prev,
            [variant.id]: {
              ...prev[variant.id],
              leftImage: "",
            },
          }))
        }
      >
        Remove
      </button>
    </div>
  </div>
)}
<br /><br />
      <label>
  <input
    type="checkbox"
    checked={data.rightEnabled}
    onChange={(e) =>
      setVariantSettings((prev) => ({
        ...prev,
        [variant.id]: {
          ...data,
          productId: product.productId,
          variantId: variant.id,
          colorName: variant.title,
          rightEnabled: e.target.checked,
        },
      }))
    }
  />
  Right
</label>

{!data.rightImage ? (
  <button
    disabled={uploadingSide === `${variant.id}-right`}
    onClick={() => uploadImage("right", variant, product)}
  >
    {uploadingSide === `${variant.id}-right`
      ? "Uploading..."
      : "Select Right Image"}
  </button>
) : (
  <div style={{ marginTop: "10px" }}>
    <img
      src={data.rightImage}
      width={100}
      style={{
        borderRadius: "6px",
        border: "1px solid #ddd",
      }}
    />

    <div
      style={{
        display: "flex",
        gap: "10px",
        marginTop: "10px",
      }}
    >
      <button
        disabled={uploadingSide === `${variant.id}-right`}
        onClick={() =>
          uploadImage("right", variant, product)
        }
      >
        {uploadingSide === `${variant.id}-right`
          ? "Uploading..."
          : "Replace"}
      </button>

      <button
        onClick={() =>
          setVariantSettings((prev) => ({
            ...prev,
            [variant.id]: {
              ...prev[variant.id],
              rightImage: "",
            },
          }))
        }
      >
        Remove
      </button>
    </div>
  </div>
)}
</div>
    </div>
  );
})}
 {printAreaModal && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    }}
  >
    <div
      style={{
  width: "900px",
  background: "#fff",
  borderRadius: "12px",
  padding: "30px",
  maxHeight: "90vh",
  overflowY: "auto",
}}
    >
     <h2>Edit Print Area</h2>

<p>
  <strong>{selectedVariant?.variant.title}</strong>
</p>
<div
  style={{
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  }}
>

  {selectedVariant?.color?.frontEnabled && (
    <button onClick={() => changeSide("front")}>
      Front
    </button>
  )}

  {selectedVariant?.color?.backEnabled && (
    <button onClick={() => changeSide("back")}>
      Back
    </button>
  )}

  {selectedVariant?.color?.leftEnabled && (
    <button onClick={() => changeSide("left")}>
      Left
    </button>
  )}

  {selectedVariant?.color?.rightEnabled && (
    <button onClick={() => changeSide("right")}>
      Right
    </button>
  )}

</div>

<div
  style={{
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
    marginBottom: "20px",
  }}
>
  <div
    style={{
      position: "relative",
      width: "450px",
    }}
  >
<img
  src={modalImage || selectedVariant?.product.image}
  style={{
    width: "100%",
    maxHeight: "550px",
    objectFit: "contain",
    display: "block",
  }}
  
/>
<Stage
  width={450}
  height={550}
  style={{
    position: "absolute",
    left: 0,
    top: 0,
  }}
>
  <Layer>
   <Rect
  ref={rectRef}
  x={printArea.x}
  y={printArea.y}
  width={printArea.width}
  height={printArea.height}
  stroke="orange"
  dash={[8, 4]}
  draggable
  onDragEnd={(e) => {
    setPrintArea((prev) => ({
      ...prev,
      x: e.target.x(),
      y: e.target.y(),
    }));
  }}
  onTransformEnd={() => {
  const node = rectRef.current;

  const width = node.width() * node.scaleX();
  const height = node.height() * node.scaleY();

  node.scaleX(1);
  node.scaleY(1);

  setPrintArea({
    x: node.x(),
    y: node.y(),
    width,
    height,
  });
}}
/>

<Transformer
  ref={transformerRef}
/>
  </Layer>
</Stage>
  </div>
</div>

<div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  }}
>
<button
  onClick={() => {
    setVariantSettings((prev) => ({
      ...prev,
      [selectedVariant.variant.id]: {
        ...prev[selectedVariant.variant.id],

        [`${editingSide}X`]: printArea.x,
        [`${editingSide}Y`]: printArea.y,
        [`${editingSide}Width`]: printArea.width,
        [`${editingSide}Height`]: printArea.height,
      },
    }));
    setSelectedVariant((prev) => ({
  ...prev,
  color: {
    ...prev.color,

    [`${editingSide}X`]: printArea.x,
    [`${editingSide}Y`]: printArea.y,
    [`${editingSide}Width`]: printArea.width,
    [`${editingSide}Height`]: printArea.height,
  },
}));
  }}
>
  Save Print Area
</button>
  <button
    onClick={() => setPrintAreaModal(false)}
  >
    Close
  </button>
</div>
    </div>
  </div>
)}
<br />

<s-button
  loading={fetcher.state === "submitting"}
  onClick={() => {

   console.log("FULL STATE");
console.log(variantSettings);

console.log("ENTRIES");
console.log(Object.entries(variantSettings));
    fetcher.submit(
      {
        colorData: JSON.stringify(
          Object.values(variantSettings)
        ),
      },
      {
        method: "POST",
      }
    );

  }}
>
  Save All Changes
</s-button>

{fetcher.data?.saved && (
  <p
    style={{
      color: "green",
      marginTop: "20px",
    }}
  >
    Changes saved successfully.
  </p>
)}
    </div>
  );
}