import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";
import { FaShoppingCart, FaArrowLeft, FaStar } from "react-icons/fa";
import "./ProductDetail.css";
import { useUser } from "../context/UserContext";
import toast from "react-hot-toast";

function ProductDetail() {
  const { id } = useParams();
  const { user } = useUser();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState({});
  const [quantity, setQuantity] = useState(1);
  const IMAGE_API = "http://localhost:4000/uploads/";

  async function getProduct() {
    try {
      const response = await api.get(`/products/product/${id}`);
      const res = response.data;
      if (res?.success) {
        setProduct(res?.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddToCart() {
    try {
      const response = await api.post("/cart/add", {
        productId: id,
        quantity,
        variant: selectedVariant,
      });
      if (response.data.success) {
        toast.success("Added to cart!");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Please login to add items to cart";
      toast.error(msg);
    }
  }

  useEffect(() => {
    getProduct();
  }, [id]);

  if (loading) return <div className="detail-loading">Loading...</div>;
  if (!product) return <div className="detail-loading">Product not found</div>;

  const discountedPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  return (
    <section className="product-detail">
      <Link to="/products" className="back-link">
        <FaArrowLeft /> Back to Products
      </Link>

      <div className="detail-layout">
        <div className="detail-images">
          <div className="main-image">
            <img
              src={IMAGE_API + product.images?.[selectedImage]}
              alt={product.title}
            />
          </div>
          {product.images?.length > 1 && (
            <div className="thumbnails">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  className={`thumb ${i === selectedImage ? "active" : ""}`}
                  onClick={() => setSelectedImage(i)}
                >
                  <img src={IMAGE_API + img} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="detail-info">
          <p className="detail-category">
            {product.category?.name || product.subcategory || "General"}
          </p>
          <h1>{product.title}</h1>

          <div className="detail-price">
            {product.discount ? (
              <>
                <span className="current-price">₹ {discountedPrice.toLocaleString()}</span>
                <span className="original-price">₹ {product.price.toLocaleString()}</span>
                <span className="discount-badge">{product.discount}% OFF</span>
              </>
            ) : (
              <span className="current-price">₹ {product.price.toLocaleString()}</span>
            )}
          </div>

          <p className="detail-description">{product.description}</p>

          {product.stock > 0 ? (
            <p className="in-stock">In Stock ({product.stock} available)</p>
          ) : (
            <p className="out-of-stock">Out of Stock</p>
          )}

          {product.variant?.length > 0 && (
            <div className="variant-section">
              <h3>Available Variants</h3>
              <div className="variant-list">
                {product.variant.map((v, i) => (
                  <button
                    key={i}
                    className={`variant-btn ${JSON.stringify(selectedVariant) === JSON.stringify(v) ? "active" : ""}`}
                    onClick={() => setSelectedVariant(v)}
                  >
                    {v.color && <span className="variant-color" style={{ background: v.color }} />}
                    {v.size && <span>{v.size}</span>}
                    {v.value && <span>{v.value}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="quantity-selector">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>

          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <FaShoppingCart /> Add to Cart
          </button>

          {product.features?.length > 0 && (
            <div className="features-section">
              <h3>Features</h3>
              <ul className="features-list">
                {product.features.map((f, i) => (
                  <li key={i}><strong>{f.key}:</strong> {f.value}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;
