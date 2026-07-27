import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";
import { FaShoppingCart, FaArrowLeft, FaTimes } from "react-icons/fa";
import "./ProductDetail.css";
import toast from "react-hot-toast";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalVariant, setModalVariant] = useState({});
  const [modalQuantity, setModalQuantity] = useState(1);
  const IMAGE_API = "http://localhost:4000/uploads/";

  const colorNameMap = {
    red: "#EF4444", blue: "#3B82F6", green: "#22C55E", black: "#000000",
    white: "#FFFFFF", yellow: "#EAB308", purple: "#A855F7", pink: "#EC4899",
    orange: "#F97316", brown: "#92400E", grey: "#6B7280", gray: "#6B7280",
    navy: "#1E3A5F", beige: "#F5F5DC", cream: "#FFFDD0", maroon: "#800000",
    teal: "#14B8A6", gold: "#D4AF37", silver: "#C0C0C0",
  };

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

  function openModal() {
    setModalVariant({});
    setModalQuantity(1);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }

  async function handleAddToCart() {
    try {
      const response = await api.post("/cart/add", {
        productId: id,
        quantity: modalQuantity,
        variant: modalVariant,
      });
      if (response.data.success) {
        toast.success("Added to cart!");
        closeModal();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Please login to add items to cart");
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

          <button className="add-to-cart-btn" onClick={openModal} disabled={product.stock === 0}>
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

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close" onClick={closeModal}><FaTimes /></button>

            <div className="detail-modal-body">
              <div className="detail-modal-image">
                <img src={IMAGE_API + product.images?.[0]} alt={product.title} />
              </div>

              <div className="detail-modal-info">
                <h2>{product.title}</h2>
                <p className="detail-modal-price">
                  ₹ {discountedPrice.toLocaleString()}
                </p>

                {product.variant?.length > 0 && (
                  <div className="detail-modal-variants">
                    <h3>Select Variant</h3>
                    <div className="detail-modal-variant-list">
                      {product.variant.map((v, i) => (
                        <button
                          key={i}
                          type="button"
                          className={`detail-modal-variant-btn ${JSON.stringify(modalVariant) === JSON.stringify(v) ? "active" : ""}`}
                          onClick={() => setModalVariant(v)}
                        >
                          {v.type === "size" && v.value}
                          {v.type === "color" && (
                            <>
                              <span className="color-dot" style={{ background: colorNameMap[v.value?.toLowerCase()] || v.value }} />
                              {v.value}
                            </>
                          )}
                          {v.type === "common" && v.value}
                          {v.type === "custom" && `${v.key}: ${v.value}`}
                          {!v.type && (v.value || v.size || v.color)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="detail-modal-quantity">
                  <h3>Quantity</h3>
                  <div className="detail-modal-qty-box">
                    <button type="button" onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}>-</button>
                    <span>{modalQuantity}</span>
                    <button type="button" onClick={() => setModalQuantity(modalQuantity + 1)}>+</button>
                  </div>
                </div>

                <button
                  type="button"
                  className="detail-modal-add-btn"
                  onClick={handleAddToCart}
                  disabled={product.variant?.length > 0 && Object.keys(modalVariant).length === 0}
                >
                  <FaShoppingCart /> Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ProductDetail;
