import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import productCSS from "./Products.module.css";
import { FaRegHeart, FaShoppingCart, FaTimes } from "react-icons/fa";
import { useUser } from "../context/UserContext";
import toast from "react-hot-toast";

function Product() {
  const [productData, setProductData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [priceRange, setPriceRange] = useState(5000);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("recommended");
  const [modalProduct, setModalProduct] = useState(null);
  const [modalVariant, setModalVariant] = useState({});
  const [modalQuantity, setModalQuantity] = useState(1);
  const { user } = useUser();
  const IMAGE_API = "http://localhost:4000/uploads/";

  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];
  const colorNameMap = {
    red: "#EF4444", blue: "#3B82F6", green: "#22C55E", black: "#000000",
    white: "#FFFFFF", yellow: "#EAB308", purple: "#A855F7", pink: "#EC4899",
    orange: "#F97316", brown: "#92400E", grey: "#6B7280", gray: "#6B7280",
    navy: "#1E3A5F", beige: "#F5F5DC", cream: "#FFFDD0", maroon: "#800000",
    teal: "#14B8A6", gold: "#D4AF37", silver: "#C0C0C0",
  };

  function openModal(product) {
    setModalProduct(product);
    setModalVariant({});
    setModalQuantity(1);
  }

  function closeModal() {
    setModalProduct(null);
    setModalVariant({});
  }

  async function handleQuickAdd(product) {
    if (product.variant?.length > 0) {
      openModal(product);
      return;
    }
    try {
      const response = await api.post("/cart/add", { productId: product._id, quantity: 1, variant: {} });
      if (response.data.success) toast.success("Added to cart!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Please login to add items to cart");
    }
  }

  async function handleModalAdd() {
    if (!modalProduct) return;
    try {
      const response = await api.post("/cart/add", {
        productId: modalProduct._id,
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

  async function getData(p = page) {
    try {
      const response = await api.get(`/products/all?page=${p}&limit=8`);
      const res = response.data;
      if (res?.success) {
        setProductData(res?.data);
        setPagination(res?.pagination);
      }
    } catch (err) {
      toast.error("Error fetching products");
      console.log(err);
    }
  }

  async function getCategories() {
    try {
      const response = await api.get("/category");
      const res = response.data;
      if (res?.success) {
        setCategories(res?.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  function handleCategoryChange(catId) {
    setSelectedCategories((prev) =>
      prev.includes(catId)
        ? prev.filter((id) => id !== catId)
        : [...prev, catId],
    );
  }

  let filteredProducts = productData.filter((product) => {
    if (selectedCategories.length > 0) {
      const catId = product.category?._id || product.category;
      if (!selectedCategories.includes(catId)) return false;
    }
    if (product.price > priceRange) return false;
    return true;
  });

  if (sortBy === "low-to-high") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === "high-to-low") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === "newest") {
    filteredProducts = [...filteredProducts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  useEffect(() => {
    getData(page);
  }, [page]);

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <main className={productCSS.container}>
      <aside className={productCSS["filter-sidebar"]}>
        <h2>Filters</h2>
        <hr className={productCSS.divider} />

        <div className={productCSS["filter-group"]}>
          <h3>Category</h3>
          {categories.map((cat) => (
            <div key={cat._id} className={productCSS["checkbox-group"]}>
              <input
                type="checkbox"
                id={cat._id}
                checked={selectedCategories.includes(cat._id)}
                onChange={() => handleCategoryChange(cat._id)}
              />
              <label htmlFor={cat._id}>{cat.icon} {cat.name}</label>
            </div>
          ))}
        </div>

        <div className={productCSS["filter-group"]}>
          <h3>SIZE</h3>
          <div className={productCSS["size-grid"]}>
            {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
              <button
                key={size}
                type="button"
                className={`${productCSS["size-btn"]} ${selectedSize === size ? productCSS["active"] : ""}`}
                onClick={() => setSelectedSize(selectedSize === size ? "" : size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className={productCSS["filter-group"]}>
          <h3>PRICE RANGE</h3>
          <div className={productCSS["price-slider-wrapper"]}>
            <input
              type="range"
              className={productCSS["price-slider"]}
              min="100"
              max="5000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
            />
            <div className={productCSS["price-labels"]}>
              <span>&#x20B9;100</span>
              <span>&#x20B9;{priceRange.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className={productCSS["apply-btn"]}
          onClick={() => { setSelectedCategories([]); setSelectedSize(""); setPriceRange(5000); }}
        >
          CLEAR FILTERS
        </button>
      </aside>

      <section className={productCSS["product-container"]}>
        <div className={productCSS["product-header"]}>
          <div className={productCSS["header-title-group"]}>
            <h1>Premium Attires</h1>
            <p className={productCSS["item-count"]}>
              Displaying {filteredProducts.length} of {pagination?.total} items
            </p>
          </div>

          <div className={productCSS["sort-dropdown-wrapper"]}>
            <label htmlFor="sort-select">
              <span className={productCSS["sortby-text"]}>SORT BY:</span>
            </label>
            <select id="sort-select" className={productCSS["sort-select"]} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="recommended">Recommended</option>
              <option value="low-to-high">Price: Low to High</option>
              <option value="high-to-low">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        <div className={productCSS["product-grid"]}>
          {filteredProducts.map((product) => (
            <div key={product?._id} className={productCSS["product-card"]}>
              <Link to={`/products/${product._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div className={productCSS["image-wrapper"]}>
                  <img
                    src={IMAGE_API + product?.images?.[0]}
                    alt={product?.title}
                  />

                  <button
                    type="button"
                    className={productCSS["favorite-btn"]}
                    aria-label="Add to favorites"
                  >
                    <FaRegHeart className={productCSS["heart-icon"]} />
                  </button>

                  <span className={productCSS["quick-add-btn"]}>
                    View Details
                  </span>
                </div>

                <div className={productCSS["product-info"]}>
                  <h2 className={productCSS["product-title"]}>{product?.title}</h2>
                  <p className={productCSS["product-price"]}>
                    ₹ {product.discount
                      ? (product.price - (product.price * product.discount) / 100).toLocaleString()
                      : product.price.toLocaleString()}
                  </p>
                </div>
              </Link>
              <button
                type="button"
                className={productCSS["cart-add-btn"]}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleQuickAdd(product); }}
              >
                <FaShoppingCart /> Add to Cart
              </button>
            </div>
          ))}
        </div>

        {pagination?.totalPages > 1 && (
          <div className={productCSS["pagination"]}>
            <button
              type="button"
              className={productCSS["page-arrow"]}
              disabled={!pagination?.isPrevPage}
              onClick={() => setPage(page - 1)}
            >
              ←
            </button>

            {new Array(pagination?.totalPages).fill(0).map((_, i) => (
              <button
                type="button"
                className={`${productCSS["page-num"]} ${page === i + 1 ? productCSS["active"] : ""}`}
                key={i}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              type="button"
              className={productCSS["page-arrow"]}
              disabled={!pagination?.isNextPage}
              onClick={() => setPage(page + 1)}
            >
              →
            </button>
          </div>
        )}
      </section>

      {modalProduct && (
        <div className={productCSS.modalOverlay} onClick={closeModal}>
          <div className={productCSS.modal} onClick={(e) => e.stopPropagation()}>
            <button type="button" className={productCSS.modalClose} onClick={closeModal}><FaTimes /></button>

            <div className={productCSS.modalBody}>
              <div className={productCSS.modalImage}>
                <img src={IMAGE_API + modalProduct.images?.[0]} alt={modalProduct.title} />
              </div>

              <div className={productCSS.modalInfo}>
                <h2>{modalProduct.title}</h2>
                <p className={productCSS.modalPrice}>
                  ₹ {modalProduct.discount
                    ? (modalProduct.price - (modalProduct.price * modalProduct.discount) / 100).toLocaleString()
                    : modalProduct.price.toLocaleString()}
                </p>

                {modalProduct.variant?.length > 0 && (
                  <div className={productCSS.modalVariants}>
                    <h3>Select Variant</h3>
                    <div className={productCSS.modalVariantList}>
                      {modalProduct.variant.map((v, i) => (
                        <button
                          key={i}
                          type="button"
                          className={`${productCSS.modalVariantBtn} ${JSON.stringify(modalVariant) === JSON.stringify(v) ? productCSS.active : ""}`}
                          onClick={() => setModalVariant(v)}
                        >
                          {v.type === "size" && v.value}
                          {v.type === "color" && (
                            <>
                              <span
                                className={productCSS.colorDot}
                                style={{
                                  background: colorNameMap[v.value?.toLowerCase()] || v.value,
                                  border: v.value?.toLowerCase() === "white" ? "1px solid #ddd" : "none",
                                }}
                              />
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

                <div className={productCSS.modalQuantity}>
                  <button type="button" onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}>-</button>
                  <span>{modalQuantity}</span>
                  <button type="button" onClick={() => setModalQuantity(modalQuantity + 1)}>+</button>
                </div>

                <button
                  type="button"
                  className={productCSS.modalAddBtn}
                  onClick={handleModalAdd}
                  disabled={modalProduct.variant?.length > 0 && Object.keys(modalVariant).length === 0}
                >
                  <FaShoppingCart /> Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Product;
