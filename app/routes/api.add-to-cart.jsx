export async function action({ request }) {
  try {
    const body = await request.json();

    console.log(body);

    const payload = {
      items: [
        {
          id: Number(body.variantId),
          quantity: Number(body.quantity),
          properties: {
            Size: body.selectedSize,
          },
        },
      ],
    };

    console.log(payload);

    const response = await fetch(
      "https://healthyfood-service.myshopify.com/cart/add.js",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const text = await response.text();

    console.log(text);

    return Response.json({
      status: response.status,
      body: text,
    });
  } catch (err) {
    console.log(err);

    return Response.json({
      error: err.message,
    });
  }
}