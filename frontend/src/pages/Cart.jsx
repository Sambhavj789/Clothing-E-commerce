import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Cart.css";
import { FaTrash, FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import { useUser } from "../context/UserContext";
import api from "../utils/api";

function Cart() {
  const { user } = useUser();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const IMAGE_API = "http://localhost:4000/uploads/";

  async function getCart() {
    try {
      const response = await api.get("/cart");
      const res = response.data;
      if (res?.success) {
        setCartItems(res.data || []);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleQuantityChange(productId, newQuantity) {
    if (newQuantity < 1) return;
    try {
      const response = await api.put("/cart/update", { productId, quantity: newQuantity });
      if (response.data.success) {
        setCartItems(response.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handleRemove(productId) {
    try {
      const response = await api.delete("/cart/remove", { data: { productId } });
      if (response.data.success) {
        setCartItems(response.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (user) {
      getCart();
    } else {
      setLoading(false);
    }
  }, [user]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.productId?.price || 0) * item.quantity,
    0,
  );

  if (loading) return <section className="cartPage"><h1>Loading...</h1></section>;

  if (!user) {
    return (
      <section className="cartPage">
        <h1>Shopping Cart</h1>
        <div className="empty-cart-message">
          <FaShoppingCart className="empty-cart-icon" />
          <h2>Please login to view your cart</h2>
          <Link to="/login" className="login-redirect-btn">Login</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="cartPage">
      <h1>Shopping Cart</h1>

      <div className="cartContainer">
        <div className="cartItems">
          {cartItems.length === 0 ? (
            <div className="empty-cart-message">
              <FaShoppingCart className="empty-cart-icon" />
              <h2>Your Cart is Empty</h2>
              <Link to="/products" className="login-redirect-btn">Continue Shopping</Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <div className="cartCard" key={item.productId?._id || item._id}>
                <img
                  src={IMAGE_API + item.productId?.images?.[0] || "https://via.placeholder.com/120"}
                  alt={item.productId?.title}
                />

                <div className="cartInfo">
                  <h3>{item.productId?.title || "Product"}</h3>
                  {item.variant?.type === "size" && <p>Size: {item.variant.value}</p>}
                  {item.variant?.type === "color" && <p>Color: {item.variant.value}</p>}
                  {item.variant?.type === "custom" && <p>{item.variant.key}: {item.variant.value}</p>}
                  {item.variant?.type === "common" && <p>{item.variant.value}</p>}
                  {!item.variant?.type && item.variant?.size && <p>Size: {item.variant.size}</p>}
                  {!item.variant?.type && item.variant?.color && <p>Color: {item.variant.color}</p>}
                  <p className="price">
                    ₹ {(item.productId?.price || 0).toLocaleString()}
                  </p>
                </div>

                <div className="cartActions">
                  <div className="quantityBox">
                    <button type="button" onClick={() => handleQuantityChange(item.productId?._id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => handleQuantityChange(item.productId?._id, item.quantity + 1)}>+</button>
                  </div>

                  <button type="button" onClick={() => handleRemove(item.productId?._id)}>
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="summary">
            <h2>Order Summary</h2>

            <div className="summaryRow">
              <span>Subtotal</span>
              <span>₹ {subtotal.toLocaleString()}</span>
            </div>

            <div className="summaryRow">
              <span>Shipping</span>
              <span>Free</span>
            </div>

            <div className="summaryRow">
              <span>Tax</span>
              <span>₹ 0</span>
            </div>

            <hr />

            <div className="summaryRow total">
              <span>Total</span>
              <span>₹ {subtotal.toLocaleString()}</span>
            </div>

            <button className="checkoutBtn">Proceed To Checkout</button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Cart;
