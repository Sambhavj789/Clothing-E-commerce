import style from "./AdminProducts.module.css";
import { AiFillDelete } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { useState, useEffect } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";
function AdminProducts() {
  let [productsData, setProductsData] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const IMAGE_API = "http://localhost:4000/uploads/";

  const [data, setData] = useState({
    title: "",
    description: "",
    price: 0,
    discount: 0,
    stock: 0,
    category: "",
    subcategory: "",
    images: [],
    oldImages: [],
  });

  const [features, setFeatures] = useState([{ key: "", value: "" }]);
  const [variants, setVariants] = useState([{ type: "size", value: "" }]);
  const [categories, setCategories] = useState([]);

  function handleChange(e) {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  }

  function handleFeatureChange(index, field, value) {
    const updated = [...features];
    updated[index][field] = value;
    setFeatures(updated);
  }

  function addFeature() {
    setFeatures([...features, { key: "", value: "" }]);
  }

  function removeFeature(index) {
    if (features.length === 1) return;
    setFeatures(features.filter((_, i) => i !== index));
  }

  function handleVariantChange(index, field, value) {
    const updated = [...variants];
    updated[index][field] = value;
    if (field === "type" && value !== "custom") {
      updated[index].key = "";
    }
    setVariants(updated);
  }

  function addVariant() {
    setVariants([...variants, { type: "size", value: "" }]);
  }

  function removeVariant(index) {
    if (variants.length === 1) return;
    setVariants(variants.filter((_, i) => i !== index));
  }

  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];
  const colorNameMap = {
    red: "#EF4444", blue: "#3B82F6", green: "#22C55E", black: "#000000",
    white: "#FFFFFF", yellow: "#EAB308", purple: "#A855F7", pink: "#EC4899",
    orange: "#F97316", brown: "#92400E", grey: "#6B7280", gray: "#6B7280",
    navy: "#1E3A5F", beige: "#F5F5DC", cream: "#FFFDD0", maroon: "#800000",
    teal: "#14B8A6", gold: "#D4AF37", silver: "#C0C0C0",
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();

    for (let key in data) {
      if (key === "images") {
        for (let image of data.images) {
          formData.append("images", image);
        }
      } else {
        formData.append(key, data[key]);
      }
    }

    formData.append("features", JSON.stringify(features.filter((f) => f.key)));
    formData.append("variant", JSON.stringify(variants.filter((v) => v.value)));

    try {
      let response;

      if (editId) {
        formData.append("productId", editId);
        formData.append("oldImages", JSON.stringify(data.oldImages || []));
        response = await api.put(`/products`, formData, {
          headers: undefined,
        });
      } else {
        response = await api.post("/products", formData, {
          headers: undefined,
        });
      }

      if (response.data.success) {
        toast.success(editId ? "Product Updated" : "Product Added");

        setEditId(null);

        setData({
          title: "",
          description: "",
          price: 0,
          discount: 0,
          stock: 0,
          category: "",
          subcategory: "",
          images: [],
          oldImages: [],
        });
        setFeatures([{ key: "", value: "" }]);
        setVariants([{ type: "size", value: "" }]);

        setIsMenuOpen(false);

        getProductsData();
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function getData() {
    const response = await api.get("/category");
    const res = response.data;
    if (res?.success) {
      setCategories(res?.data);
    }
  }

  async function getProductsData() {
    const response = await api.get("/products/all");
    const res = response.data;
    if (res?.success) {
      setProductsData(res?.data);
    }
  }
  useEffect(() => {
    getData();
    getProductsData();
  }, []);

  async function deleteProduct(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) return;

    try {
      const response = await api.delete("/products", {
        data: {
          productId: id,
        },
      });

      if (response.data.success) {
        toast.success("Product Deleted Successfully");
        getProductsData();
      }
    } catch (err) {
      console.log(err);
      toast.error("Error deleting product");
    }
  }

  function editProduct(product) {
    setEditId(product._id);

    setData({
      title: product.title,
      description: product.description,
      price: product.price,
      discount: product.discount,
      stock: product.stock,
      category: product.category?._id || product.category,
      subcategory: product.subcategory,
      images: [],
      oldImages: product.images || [],
    });

    if (product.features?.length) {
      setFeatures(product.features);
    } else {
      setFeatures([{ key: "", value: "" }]);
    }

    if (product.variant?.length) {
      const mapped = product.variant.map((v) => {
        if (v.type) return v;
        const hasKey = v.key && v.key !== "size" && v.key !== "color";
        return { type: hasKey ? "custom" : (v.key || "common"), key: hasKey ? v.key : "", value: v.value || v.size || v.color || "" };
      });
      setVariants(mapped);
    } else {
      setVariants([{ type: "size", value: "" }]);
    }

    setIsMenuOpen(true);
  }

  return (
    <section className={style.adminProducts}>
      {isMenuOpen && (
        <div className={style.addProductOverlay}>
          <form className={style.addProductForm}>
            <div className={style.addProductHeader}>
              <h1>{editId ? "Update Product" : "Add Product"}</h1>
              <RxCross2
                className={style.closeButton}
                onClick={() => setIsMenuOpen(false)}
              />
            </div>

            <div className={style.formBody}>
              <div className={style.formRow}>
                <label>Product Name</label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  name="title"
                  onChange={handleChange}
                  value={data.title}
                />
              </div>

              <div className={style.formRow}>
                <label>Description</label>
                <textarea
                  rows="5"
                  placeholder="Enter product description"
                  name="description"
                  onChange={handleChange}
                  value={data.description}
                />
              </div>

              <div className={style.formRow}>
                <label>Price</label>
                <input
                  type="number"
                  placeholder="Enter price"
                  name="price"
                  onChange={handleChange}
                  value={data.price}
                />
              </div>

              <div className={style.formRow}>
                <label>Discount (%)</label>
                <input
                  type="number"
                  placeholder="Enter discount"
                  name="discount"
                  onChange={handleChange}
                  value={data.discount}
                />
              </div>

              <div className={style.formRow}>
                <label>Stock</label>
                <input
                  type="number"
                  placeholder="Available stock"
                  name="stock"
                  onChange={handleChange}
                  value={data.stock}
                />
              </div>

              <div className={style.formRow}>
                <label>Category</label>

                <select
                  name="category"
                  value={data.category}
                  onChange={handleChange}
                >
                  <option>Select Category</option>
                  {categories.map((category) => {
                    return (
                      <option value={category._id} key={category._id}>
                        {category?.name}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className={style.formRow}>
                <label>Sub Category</label>

                <input
                  type="text"
                  placeholder="Sub Category"
                  name="subcategory"
                  value={data.subcategory}
                  onChange={handleChange}
                />
              </div>

              <div className={style.formRow}>
                <label>Product Images</label>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    setData({ ...data, images: e.target.files });
                  }}
                />
              </div>

              <div className={`${style.formRow} ${style.section}`}>
                <h3>Features</h3>
                {features.map((feature, index) => (
                  <div key={index} className={style.featureRow}>
                    <input
                      type="text"
                      placeholder="Key (e.g. Material)"
                      value={feature.key}
                      onChange={(e) => handleFeatureChange(index, "key", e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g. Cotton)"
                      value={feature.value}
                      onChange={(e) => handleFeatureChange(index, "value", e.target.value)}
                    />
                    <button type="button" onClick={addFeature}><FaPlus /></button>
                    {features.length > 1 && (
                      <button type="button" onClick={() => removeFeature(index)} style={{ background: "#dc2626" }}><FaTrash /></button>
                    )}
                  </div>
                ))}
              </div>

              <div className={`${style.formRow} ${style.section}`}>
                <h3>Variants</h3>
                {variants.map((variant, index) => (
                  <div key={index} className={style.variantRow}>
                    <select
                      value={variant.type}
                      onChange={(e) => handleVariantChange(index, "type", e.target.value)}
                      className={style.variantTypeSelect}
                    >
                      <option value="size">Size</option>
                      <option value="color">Color</option>
                      <option value="common">Common</option>
                      <option value="custom">Custom</option>
                    </select>

                    {variant.type === "size" && (
                      <div className={style.sizeChips}>
                        {sizeOptions.map((s) => (
                          <button
                            key={s}
                            type="button"
                            className={`${style.sizeChip} ${variant.value === s ? style.sizeChipActive : ""}`}
                            onClick={() => handleVariantChange(index, "value", s)}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}

                    {variant.type === "color" && (
                      <div className={style.colorInputRow}>
                        <input
                          type="text"
                          placeholder="Color name (e.g. Red)"
                          value={variant.value}
                          onChange={(e) => handleVariantChange(index, "value", e.target.value)}
                        />
                        {variant.value && (
                          <span
                            className={style.colorSwatch}
                            style={{
                              background: colorNameMap[variant.value.toLowerCase()] || variant.value,
                              border: variant.value.toLowerCase() === "white" ? "1px solid #ddd" : "none",
                            }}
                          />
                        )}
                      </div>
                    )}

                    {variant.type === "common" && (
                      <input
                        type="text"
                        placeholder="Value"
                        value={variant.value}
                        onChange={(e) => handleVariantChange(index, "value", e.target.value)}
                      />
                    )}

                    {variant.type === "custom" && (
                      <div className={style.customRow}>
                        <input
                          type="text"
                          placeholder="Key (e.g. Material)"
                          value={variant.key}
                          onChange={(e) => handleVariantChange(index, "key", e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Value (e.g. Cotton)"
                          value={variant.value}
                          onChange={(e) => handleVariantChange(index, "value", e.target.value)}
                        />
                      </div>
                    )}

                    <button type="button" onClick={addVariant}><FaPlus /></button>
                    {variants.length > 1 && (
                      <button type="button" onClick={() => removeVariant(index)} style={{ background: "#dc2626" }}><FaTrash /></button>
                    )}
                  </div>
                ))}
              </div>

              <input
                type="submit"
                className={style.submitBtn}
                onClick={handleSubmit}
                value={editId ? "Update Product" : "Add Product"}
              />
            </div>
          </form>
        </div>
      )}

      <div className={style.adminProductsHeader}>
        <h1>Admin Products</h1>
        <button onClick={() => setIsMenuOpen(true)}>Add Product</button>
      </div>

      <div className={style.adminProductGrid}>
        {productsData.map((product) => (
          <div key={product?._id} className={style.adminCard}>
            <div className={style.adminCardImage}>
              <img
                src={IMAGE_API + product?.images?.[0]}
                alt={product?.title}
              />
              <button
                type="button"
                className={style.productDeleteBtn}
                onClick={() => deleteProduct(product._id)}
              >
                <AiFillDelete />
              </button>
            </div>

            <div className={style.adminCardInfo}>
              <h3 className={style.adminCardTitle}>{product?.title}</h3>
              <p className={style.adminCardPrice}>
                ₹ {product.price.toLocaleString()}
              </p>
            </div>

            <div className={style.adminCardActions}>
              <button className={style.editBtn} onClick={() => editProduct(product)}>
                <FaEdit /> Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AdminProducts;
