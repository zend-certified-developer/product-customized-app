import { useState, useRef, useEffect } from "react";
import {
  Stage,
  Layer,
  Text,
  Transformer,
  Image as KonvaImage,
} from "react-konva";
import useImage from "use-image";
import html2canvas from "html2canvas";
import "../dashboard.css";

function URLImage({
  item,
  onDragEnd,
  onTransformEnd,
   onSelect,
}){
 const [image] = useImage(item.src);

  const [selected, setSelected] = useState(false);
  

  const imageRef = useRef();
  const transformerRef = useRef();
  const stageRef = useRef();
  
  useEffect(() => {
    if (selected) {
      transformerRef.current.nodes([imageRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selected]);

  return (
    <>
      <KonvaImage
        ref={imageRef}
        image={image}
       x={item.x}
       y={item.y}
        width={item.width}
height={item.height}
        rotation={item.rotation || 0}
        draggable
        onClick={() => {setSelected(true);
        onSelect?.();
      }}
        onTap={() =>{ setSelected(true);
        onSelect?.();

        }}
    onDragEnd={(e) => {
  onDragEnd?.(e);
}}
onTransformEnd={() => {
  const node = imageRef.current;

  onTransformEnd?.({
    width: node.width() * node.scaleX(),
    height: node.height() * node.scaleY(),
    rotation: node.rotation(),
  });

  node.scaleX(1);
  node.scaleY(1);
}}

      />

      {selected && (
        <Transformer
          ref={transformerRef}
          rotateEnabled={true}
        />
      )}
    </>
  );
}
export default function DesignerClient({
  productId,
   variantId,
   shopUrl,
}) {
  
  
  const [productData, setProductData] =
  useState(null);
  
  const [productColors, setProductColors] =
    useState([]);
useEffect(() => {
  if (!productId) {
    console.log("NO PRODUCT ID:", productId);
    return;
  }

  fetch(
    `/apps/customizer/api/product?productId=${productId}`
  )
    .then(async (res) => {
      console.log("PRODUCT API STATUS:", res.status);

      const data = await res.json();

      console.log("PRODUCT API DATA:", data);

      return data;
    })
    .then((data) => {
      setProductData(data.product);
      setProductColors(data.colors);
    })
    .catch((err) => {
      console.error("PRODUCT API ERROR:", err);
    });
}, [productId]);
  const [view, setView] = useState("front");
  const [captureView, setCaptureView] =
  useState(null);
  const [loaded, setLoaded] =
  useState(false);
  const [designs, setDesigns] = useState({
  front: {
    texts: [],
    images: [],
  },
  back: {
    texts: [],
    images: [],
  },
left: {
  texts: [],
  images: [],
},

right: {
  texts: [],
  images: [],
},
});
useEffect(() => {
  if (!productId) return;

  const savedDesign =
    localStorage.getItem(
      `design-${productId}`
    );

if (savedDesign) {
  const parsed = JSON.parse(savedDesign);

  setDesigns({
    front: parsed.front || {
      texts: [],
      images: [],
    },

    back: parsed.back || {
      texts: [],
      images: [],
    },

    left: parsed.left || {
      texts: [],
      images: [],
    },

    right: parsed.right || {
      texts: [],
      images: [],
    },
  });
}

  setLoaded(true);
}, [productId]);

useEffect(() => {
  if (!productId || !loaded)
    return;

  localStorage.setItem(
    `design-${productId}`,
    JSON.stringify(designs)
  );
}, [designs, loaded]);
const [selectedSize, setSelectedSize] = useState("M");
const [quantity, setQuantity] = useState(1);
const [adding, setAdding] = useState(false);
const [designArea, setDesignArea] = useState({
  front: {
    top: 140,
    left: 170,
    width: 160,
    height: 180,
  },
  back: {
    top: 140,
    left: 170,
    width: 160,
    height: 180,
  },
  left: {
    top: 140,
    left: 170,
    width: 160,
    height: 180,
  },
  right: {
    top: 140,
    left: 170,
    width: 160,
    height: 180,
  },
});
const [editArea, setEditArea] = useState(true);
  // const image = stageRef.current.toDataURL({
  //   pixelRatio: 3,
  // });
const uploadDesign = async () => {
  const canvas = await html2canvas(
    tshirtRef.current,
    {
      backgroundColor: null,
      useCORS: true,
      scale: 1,
    }
  );

  const image = canvas.toDataURL("image/png");
  const formData = new FormData();

  formData.append("file", image);
  formData.append(
    "upload_preset",
    "designer"
  );

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/fuyksn9p/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  console.log(data);

  return data.secure_url;
};

const [color, setColor] = useState("");
useEffect(() => {
  console.log("iframe variant:", variantId);

  console.log(
    productColors.map((c) => ({
      color: c.colorName,
      variant: c.variantId.split("/").pop(),
    }))
  );

  if (!variantId || productColors.length === 0)
    return;

  const matchedColor = productColors.find(
    (c) =>
      c.variantId.split("/").pop() ===
      String(variantId)
  );


  if (matchedColor) {
    setColor(matchedColor.colorName);
  }
}, [variantId, productColors]);
 const [customText, setCustomText] = useState("");
const [selectedTextId, setSelectedTextId] = useState(null);
const [selectedImageId, setSelectedImageId] = useState(null);
const [designImage, setDesignImage] = useState("");



const textRefs = useRef({});
const tshirtRef = useRef();
const stageRef = useRef();

const transformerRef = useRef();
useEffect(() => {
  if (!selectedTextId) return;

  const node = textRefs.current[selectedTextId];

  if (node && transformerRef.current) {
    transformerRef.current.nodes([node]);
    transformerRef.current.getLayer().batchDraw();
  }
}, [selectedTextId]);
const [fontSize, setFontSize] = useState(22);
const activeView =
  captureView || view;

const selectedColor =
  productColors.find(
    (c) => c.colorName === color
  );
useEffect(() => {
  if (!selectedColor) return;

  if (selectedColor.frontEnabled) {
    setView("front");
  } else if (selectedColor.backEnabled) {
    setView("back");
  } else if (selectedColor.leftEnabled) {
    setView("left");
  } else if (selectedColor.rightEnabled) {
    setView("right");
  }
}, [selectedColor]);
useEffect(() => {
  if (!selectedColor) return;
console.log("DESIGN AREA", {
  front: {
    top: selectedColor.frontY,
    left: selectedColor.frontX,
    width: selectedColor.frontWidth,
    height: selectedColor.frontHeight,
  },
  back: {
    top: selectedColor.backY,
    left: selectedColor.backX,
    width: selectedColor.backWidth,
    height: selectedColor.backHeight,
  },
});
  setDesignArea({
    front: {
      top: selectedColor.frontY,
      left: selectedColor.frontX,
      width: selectedColor.frontWidth,
      height: selectedColor.frontHeight,
    },

    back: {
      top: selectedColor.backY,
      left: selectedColor.backX,
      width: selectedColor.backWidth,
      height: selectedColor.backHeight,
    },

    left: {
      top: selectedColor.leftY,
      left: selectedColor.leftX,
      width: selectedColor.leftWidth,
      height: selectedColor.leftHeight,
    },

    right: {
      top: selectedColor.rightY,
      left: selectedColor.rightX,
      width: selectedColor.rightWidth,
      height: selectedColor.rightHeight,
    },
  });
}, [selectedColor]);
const currentArea = designArea[activeView];
const imageMap = {
  front: selectedColor?.frontImage,
  back: selectedColor?.backImage,
  left: selectedColor?.leftImage,
  right: selectedColor?.rightImage,
};

const tshirtImage =
  imageMap[activeView];

const texts =
  designs[activeView].texts;

const images =
  designs[activeView].images;

  const selectedText = texts.find(
  (t) => t.id === selectedTextId
);

const uploadSingleView = async (side) => {
  console.log("Started:", side);

  setCaptureView(side);

  await new Promise((r) => setTimeout(r, 500));

  console.time(`Capture ${side}`);

  const canvas = await html2canvas(tshirtRef.current, {
    backgroundColor: null,
    useCORS: true,
    scale: 2,
  });

  console.timeEnd(`Capture ${side}`);

  // const image = canvas.toDataURL("image/png");
const image = canvas.toDataURL("image/jpeg", 0.8);
console.log(
  "Image size:",
  ((image.length * 3) / 4 / 1024 / 1024).toFixed(2),
  "MB"
);
  const formData = new FormData();
  formData.append("file", image);
  formData.append("upload_preset", "designer");

  console.time(`Upload ${side}`);

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/fuyksn9p/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  console.timeEnd(`Upload ${side}`);

  const data = await response.json();

  return data.secure_url;
};

if (!productData) {
  return <div>Loading...</div>;
}
  return (
    <>
      
   <div className="designer-layout">
      {/* LEFT PANEL */}
      <div className="designer-sidebar">
 <div className="designer-heading">
  <h2>Customize Your Product</h2>

  <p
    style={{
      color: "#666",
      fontSize: "14px",
    }}
  >
    Add text, upload images and personalize your design.
  </p>
</div>

    <div className="tool-card">
  <h3>Views</h3>
  <div className="view-buttons">
      {selectedColor?.frontEnabled && (
  <button onClick={() => setView("front")}>
    Front
  </button>
)}

{selectedColor?.backEnabled && (
  <button onClick={() => setView("back")}>
    Back
  </button>
)}

{selectedColor?.leftEnabled && (
  <button onClick={() => setView("left")}>
    Left Sleeve
  </button>
)}

{selectedColor?.rightEnabled && (
  <button onClick={() => setView("right")}>
    Right Sleeve
  </button>
)}
</div>
        </div>



        <div>

<div
  style={{
    marginBottom: "20px",
  }}
>
  Selected Color: <strong>{color}</strong>
</div>

        <hr />

        <input
          type="text"
          placeholder="Enter text"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          style={{
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  marginBottom: "10px",
}}
        />
        <button
  onClick={() => {
    if (!customText.trim()) return;

   setDesigns((prev) => ({
  ...prev,
  [view]: {
    ...prev[view],
    texts: [
      ...prev[view].texts,
      {
        id: Date.now(),
        text: customText,
        x: 20,
        y: 20,
        fontSize: 22,
        rotation: 0,
        width: 120,
        fill: "#000000",
      },
    ],
  },
}));

    setCustomText("");
  }}
>
  Add Text
</button>
{selectedText && (
  <>
    <hr />

    <h3>Text Settings</h3>

    <label>Font Size</label>

    <input
      type="range"
      min="8"
      max="100"
      value={selectedText.fontSize}
      onChange={(e) => {
        const size = Number(e.target.value);

        setDesigns((prev) => ({
          ...prev,
          [view]: {
            ...prev[view],
            texts: prev[view].texts.map((t) =>
              t.id === selectedTextId
                ? {
                    ...t,
                    fontSize: size,
                  }
                : t
            ),
          },
        }));
      }}
      style={{
        width: "100%",
      }}
    />
<label>Text Color</label>

<input
  type="color"
  value={selectedText.fill || "#000000"}
  onChange={(e) => {
    setDesigns((prev) => ({
      ...prev,
      [view]: {
        ...prev[view],
        texts: prev[view].texts.map((t) =>
          t.id === selectedTextId
            ? {
                ...t,
                fill: e.target.value,
              }
            : t
        ),
      },
    }));
  }}
/>
    <input
      type="number"
      min="8"
      max="100"
      value={selectedText.fontSize}
      onChange={(e) => {
        const size = Number(e.target.value);

        setDesigns((prev) => ({
          ...prev,
          [view]: {
            ...prev[view],
            texts: prev[view].texts.map((t) =>
              t.id === selectedTextId
                ? {
                    ...t,
                    fontSize: size,
                  }
                : t
            ),
          },
        }));
      }}
      style={{
        width: "100%",
        marginTop: "10px",
      }}
    />
  </>
)}
<h3>Upload Image</h3>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
           const file = e.target.files[0];

if (file) {
  const reader = new FileReader();

  reader.onload = () => {
    setDesigns((prev) => ({
      ...prev,
      [view]: {
        ...prev[view],
        images: [
          ...prev[view].images,
          {
            id: Date.now(),
            src: reader.result,
            x: 20,
            y: 60,
            width: 80,
            height: 80,
            rotation: 0,
          },
        ],
      },
    }));
  };

  reader.readAsDataURL(file);
}
          }}
          
        />
        <hr />
        <div className="actions-delete">
<h3>Actions</h3>
        <button
  onClick={() => {
    if (selectedTextId) {
      setDesigns((prev) => ({
        ...prev,
        [view]: {
          ...prev[view],
          texts: prev[view].texts.filter(
            (t) => t.id !== selectedTextId
          ),
        },
      }));

      setSelectedTextId(null);
    }

    if (selectedImageId) {
      setDesigns((prev) => ({
        ...prev,
        [view]: {
          ...prev[view],
          images: prev[view].images.filter(
            (img) => img.id !== selectedImageId
          ),
        },
      }));

      setSelectedImageId(null);
    }
  }}
>
  Delete Selected
</button>
</div>
      </div>
        </div>

      {/* CENTER */}
     <div className="designer-center">
  <div
  ref={tshirtRef}
  className="tshirt-preview"
>
         <img
  src={tshirtImage}
  className="tshirt-image"
onLoad={(e) => {
  console.log(
    "IMAGE",
    e.target.getBoundingClientRect()
  );

  console.log(
    "PARENT",
    e.target.parentElement.getBoundingClientRect()
  );
}}
/>         <div
           style={{
  position: "absolute",
  top: currentArea.top + 30,
  left: currentArea.left + 30,
  width: currentArea.width,
  height: currentArea.height,
  border: "2px dashed #bdbdbd",
  overflow: "hidden",
}}
          >
<Stage
  ref={stageRef}
  width={currentArea.width}
  height={currentArea.height}
>
  <Layer>
   {texts.map((item) => (
  <Text
    key={item.id}
    ref={(node) => {
      if (node) {
        textRefs.current[item.id] = node;
      }
    }}
    text={item.text}
    x={item.x}
    y={item.y}
    fontSize={item.fontSize}
    width={item.width}
    rotation={item.rotation || 0}
    fill={item.fill || "#000000"}
    scaleX={1}
scaleY={1}
    draggable
    onClick={() => {setSelectedTextId(item.id);
      setSelectedImageId(null);
    }}
    onTap={() => {setSelectedTextId(item.id);
      setSelectedImageId(null);
    }}
  onDragEnd={(e) => {
  setDesigns((prev) => ({
    ...prev,
    [view]: {
      ...prev[view],
      texts: prev[view].texts.map((t) =>
        t.id === item.id
          ? {
              ...t,
              x: e.target.x(),
              y: e.target.y(),
            }
          : t
      ),
    },
  }));
}}
onTransformEnd={() => {
  const node = textRefs.current[item.id];

  const newWidth =
    node.width() * node.scaleX();

  setDesigns((prev) => ({
    ...prev,
    [view]: {
      ...prev[view],
      texts: prev[view].texts.map((t) =>
        t.id === item.id
          ? {
              ...t,
              width: newWidth,
              rotation: node.rotation(),
            }
          : t
      ),
    },
  }));

  node.scaleX(1);
}} 
  />
))}
<Transformer
  ref={transformerRef}
  rotateEnabled={true}
  enabledAnchors={[
    "middle-left",
    "middle-right",
  ]}
/>
{images.map((item) => (
  <URLImage
    key={item.id}
    item={item}
    onSelect={() => {
  setSelectedImageId(item.id);
  setSelectedTextId(null);
}}
  onDragEnd={(e) => {
  setDesigns((prev) => ({
    ...prev,
    [view]: {
      ...prev[view],
      images: prev[view].images.map((img) =>
        img.id === item.id
          ? {
              ...img,
              x: e.target.x(),
              y: e.target.y(),
            }
          : img
      ),
    },
  }));
}}
onTransformEnd={(data) => {
  setDesigns((prev) => ({
    ...prev,
    [view]: {
      ...prev[view],
      images: prev[view].images.map((img) =>
        img.id === item.id
          ? {
              ...img,
              width: data.width,
              height: data.height,
              rotation: data.rotation,
            }
          : img
      ),
    },
  }));
}}
  />
))}
  </Layer>
</Stage>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="designer-right">
      <h2>{productData?.title}</h2>


<hr />

<h3>Size</h3>

<div
  style={{
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  }}
>
  {["S", "M", "L", "XL"].map((size) => (
    <button
      key={size}
      onClick={() => setSelectedSize(size)}
      style={{
        padding: "8px 12px",
        border:
          selectedSize === size
            ? "2px solid black"
            : "1px solid #ccc",
      }}
    >
      {size}
    </button>
  ))}
</div>

<hr />

<h3>Quantity</h3>

<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
  }}
>
  <button
    onClick={() =>
      setQuantity((q) =>
        Math.max(1, q - 1)
      )
    }
  >
    -
  </button>

  <span>{quantity}</span>

  <button
    onClick={() =>
      setQuantity((q) => q + 1)
    }
  >
    +
  </button>
</div>

<hr />


<h2>₹{productData?.price}</h2>

<button
  disabled={adding}
  onClick={async () => {
    try {
      setAdding(true);

      const frontImage =
        selectedColor?.frontEnabled
          ? await uploadSingleView("front")
          : "";

      const backImage =
        selectedColor?.backEnabled
          ? await uploadSingleView("back")
          : "";

      const leftImage =
        selectedColor?.leftEnabled
          ? await uploadSingleView("left")
          : "";

      const rightImage =
        selectedColor?.rightEnabled
          ? await uploadSingleView("right")
          : "";

      setCaptureView(null);

      window.parent.postMessage(
        {
          type: "ADD_TO_CART",
          variantId: Number(variantId),
          quantity,
          selectedSize,
          frontImage,
          backImage,
          leftImage,
          rightImage,
        },
        "*"
      );
    } catch (err) {
      console.error(err);
      setAdding(false);
    }
  }}
>
  {adding ? "Uploading..." : "Add To Cart"}
</button>
      </div>
    </div>
    </>
  );


}
