import "../dashboard.css";
import { useLoaderData } from "react-router";
import { useState } from "react";

export const loader = async () => {
  return {
    orders: [
      {
        id: "#1001",
        customer: "John Doe",
        product: "Custom T-Shirt",
        date: "20 Jul 2026",
        status: "Completed",
        designs: [
          {
            side: "Front",
            url: "https://via.placeholder.com/120"
          },
          {
            side: "Back",
            url: "https://via.placeholder.com/120"
          }
        ]
      },
      {
        id: "#1002",
        customer: "Alice Smith",
        product: "Custom Hoodie",
        date: "19 Jul 2026",
        status: "Completed",
        designs: [
          {
            side: "Front",
            url: "https://via.placeholder.com/120"
          }
        ]
      }
    ]
  };
};


export default function Orders() {
  const { orders } = useLoaderData();

const [search, setSearch] = useState("");
const [status, setStatus] = useState("All");
const [selectedOrder, setSelectedOrder] = useState(null);
const filteredOrders = orders.filter((order) => {
  const matchesSearch =
    order.id.toLowerCase().includes(search.toLowerCase()) ||
    order.customer.toLowerCase().includes(search.toLowerCase());

  const matchesStatus =
    status === "All" || order.status === status;

  return matchesSearch && matchesStatus;
});

  return (
    <s-page heading="Orders">

      <div className="settings-card">
<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
    gap: "15px",
  }}
>

  <input
    type="text"
    placeholder="Search order..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={{
      flex: 1,
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #ddd",
    }}
  />

  <select
    value={status}
    onChange={(e) => setStatus(e.target.value)}
    style={{
      padding: "10px",
      borderRadius: "8px",
    }}
  >
    <option>All</option>
    <option>Completed</option>
    <option>Pending</option>
  </select>

</div>
        <table className="orders-table">

          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Date</th>
              <th>Status</th>
              <th>Designs</th>
              <th>Action</th>
            </tr>
          </thead>
<tbody>

  {filteredOrders.length === 0 ? (

    <tr>
      <td
        colSpan="7"
        style={{
          textAlign: "center",
          padding: "20px",
          color: "#666",
        }}
      >
        No orders found.
      </td>
    </tr>

  ) : (

    filteredOrders.map((order) => (

      <tr key={order.id}>

        <td>{order.id}</td>

        <td>{order.customer}</td>

        <td>{order.product}</td>

        <td>{order.date}</td>

        <td>
          <span className="status-success">
            {order.status}
          </span>
        </td>

        <td>

          {order.designs.map((design) => (

            <div key={design.side}>

              <strong>{design.side}</strong>

              <br />

              <a
                href={design.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Design
              </a>

            </div>

          ))}

        </td>

        <td>

          <button
            onClick={() => setSelectedOrder(order)}
            style={{
              padding: "8px 14px",
              border: "none",
              background: "#000",
              color: "#fff",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            View Order
          </button>

        </td>

      </tr>

    ))

  )}

</tbody>
        </table>

      </div>
{selectedOrder && (
  <div className="modal-overlay">

    <div className="modal-box">

      <h2>{selectedOrder.id}</h2>

      <p>
        <strong>Customer:</strong>{" "}
        {selectedOrder.customer}
      </p>

      <p>
        <strong>Product:</strong>{" "}
        {selectedOrder.product}
      </p>

      <p>
        <strong>Date:</strong>{" "}
        {selectedOrder.date}
      </p>

      <p>
        <strong>Status:</strong>{" "}
        {selectedOrder.status}
      </p>

      <hr />

      <h3>Designs</h3>

      {selectedOrder.designs.map((design) => (
        <div key={design.side}>
          <strong>{design.side}</strong>{" "}
          <a
            href={design.url}
            target="_blank"
          >
            View Design
          </a>
        </div>
      ))}

      <br />

      <button
        onClick={() =>
          setSelectedOrder(null)
        }
      >
        Close
      </button>

    </div>

  </div>
)}
    </s-page>
  );
}