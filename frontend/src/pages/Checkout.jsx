import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import { useUser } from "../context/UserContext";
import toast from "react-hot-toast";
import { FaArrowLeft, FaTruck, FaPhone, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import "./Checkout.css";

function Checkout() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    shippingAddress: "",
    contactNumber: "",
    alternateNumber: "",
  });
  const IMAGE_API = "http://localhost:4000/uploads/";

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    api.get("/cart").then((res) => {
      if (res.data?.success) {
        if (!res.data.data.length) {
          navigate("/cart");
          return;
        }
        setCartItems(res.data.data);
        setForm((prev) => ({
          ...prev,
          fullName: user.name || "",
          contactNumber: user.contactNumber?.toString() || "",
        }));
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  const subtotal = cartItems.reduce((s, i) => s + (i.productId?.price || 0) * i.quantity, 0);
  const total = subtotal;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.shippingAddress.trim()) return toast.error("Enter delivery address");
    if (!form.contactNumber.trim()) return toast.error("Enter contact number");
    if (!form.fullName.trim()) return toast.error("Enter full name");

    setPlacing(true);
    try {
      const items = cartItems.map((i) => ({
        productId: i.productId._id,
        quantity: i.quantity,
        variant: i.variant,
      }));
      const response = await api.post("/orders/create", {
        items,
        shippingAddress: form.shippingAddress,
        contactNumber: form.contactNumber,
        alternateNumber: form.alternateNumber,
        totalOrderValue: total,
        payementMode: "COD",
        paymentStatus: "pending",
      });
      if (response.data.success) {
        toast.success("Order placed successfully!");
        navigate("/orders");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  }

  if (loading) return <section className="checkout-page"><p className="checkout-loading">Loading...</p></section>;
  if (!user) return <section className="checkout-page"><p className="checkout-loading">Please login to checkout.</p></section>;

  return (
    <section className="checkout-page">
      <div className="checkout-header">
        <button className="checkout-back" onClick={() => navigate("/cart")}><FaArrowLeft /></button>
        <h1>Checkout</h1>
      </div>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="checkout-section">
            <h2><FaUser /> Contact Info</h2>
            <div className="checkout-field">
              <label>Full Name *</label>
              <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="John Doe" />
            </div>
            <div className="checkout-field">
              <label><FaPhone /> Contact Number *</label>
              <input name="contactNumber" value={form.contactNumber} onChange={handleChange} placeholder="9876543210" type="tel" />
            </div>
            <div className="checkout-field">
              <label>Alternate Number</label>
              <input name="alternateNumber" value={form.alternateNumber} onChange={handleChange} placeholder="Optional" type="tel" />
            </div>
          </div>

          <div className="checkout-section">
            <h2><FaMapMarkerAlt /> Delivery Address</h2>
            <div className="checkout-field">
              <label>Address *</label>
              <textarea
                name="shippingAddress"
                value={form.shippingAddress}
                onChange={handleChange}
                placeholder="Street, city, state, pincode..."
                rows={4}
              />
            </div>
          </div>

          <div className="checkout-section">
            <h2><FaTruck /> Payment Method</h2>
            <div className="checkout-payment-option selected">
              <span className="payment-radio" />
              <div>
                <strong>Cash on Delivery</strong>
                <p>Pay when you receive your order</p>
              </div>
            </div>
          </div>

          <button type="submit" className="checkout-place-btn" disabled={placing}>
            {placing ? "Placing Order..." : `Place Order • ₹${total.toLocaleString()}`}
          </button>
        </form>

        <aside className="checkout-summary">
          <h3>Order Summary</h3>
          <div className="checkout-summary-items">
            {cartItems.map((item) => (
              <div key={item._id} className="checkout-summary-item">
                <img src={item.productId?.images?.[0] ? IMAGE_API + item.productId.images[0] : "https://via.placeholder.com/60"} alt="" />
                <div>
                  <p className="checkout-item-title">{item.productId?.title}</p>
                  {Array.isArray(item.variant) && item.variant.map((v, vi) => (
                    <span key={vi} className="checkout-item-variant">
                      {v.type === "size" ? v.value : v.type === "color" ? v.value : v.type === "custom" ? `${v.key}: ${v.value}` : v.value}
                    </span>
                  ))}
                  <p className="checkout-item-qty">Qty: {item.quantity}</p>
                </div>
                <span className="checkout-item-price">₹{((item.productId?.price || 0) * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <hr />
          <div className="checkout-summary-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
          <div className="checkout-summary-row"><span>Shipping</span><span>Free</span></div>
          <div className="checkout-summary-row checkout-summary-total"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
        </aside>
      </div>
    </section>
  );
}

export default Checkout;
