import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { useUser } from "../context/UserContext";
import "./Orders.css";
import { FaShoppingBag, FaTruck } from "react-icons/fa";

function Orders() {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const IMAGE_API = "http://localhost:4000/uploads/";

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    api.get("/orders/user-orders").then((res) => {
      if (res.data?.success) setOrders(res.data.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  const statusColor = {
    pending: "#f59e0b",
    shipped: "#3b82f6",
    delivered: "#16a34a",
    cancelled: "#dc2626",
    returned: "#8b5cf6",
  };

  if (loading) return <section className="orders-page"><p className="orders-loading">Loading...</p></section>;
  if (!user) return <section className="orders-page"><p className="orders-loading">Please login to view orders.</p></section>;

  return (
    <section className="orders-page">
      <div className="orders-header">
        <h1>My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="orders-empty">
          <FaShoppingBag className="orders-empty-icon" />
          <h2>No orders yet</h2>
          <p>Start shopping to see your orders here.</p>
          <Link to="/products" className="orders-shop-btn">Browse Products</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-card-header">
                <div>
                  <span className="order-id">#{order._id.slice(-8)}</span>
                  <span className="order-date">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
                <span className="order-status" style={{ background: statusColor[order.orderStatus] || "#888", color: "#fff" }}>
                  {order.orderStatus}
                </span>
              </div>

              <div className="order-card-body">
                {order.items?.map((item, i) => (
                  <div key={i} className="order-item">
                    <img src={item.productId?.images?.[0] ? IMAGE_API + item.productId.images[0] : "https://via.placeholder.com/60"} alt="" />
                    <div>
                      <p className="order-item-title">{item.productId?.title || "Product"}</p>
                      {item.variant && Array.isArray(item.variant) && item.variant.map((v, vi) => (
                        <span key={vi} className="order-item-variant">
                          {v.type === "size" ? v.value : v.type === "color" ? v.value : v.type === "custom" ? `${v.key}: ${v.value}` : ""}
                        </span>
                      ))}
                      <p className="order-item-qty">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-card-footer">
                <span className="order-total">₹{order.totalOrderValue?.toLocaleString()}</span>
                <span className="order-payment">{order.payementMode}</span>
                <Link to={`/products`} className="order-reorder">Shop Again</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Orders;
