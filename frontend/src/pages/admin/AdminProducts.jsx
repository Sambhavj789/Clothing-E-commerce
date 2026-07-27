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
  const [variants, setVariants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [customSizeInput, setCustomSizeInput] = useState("");
  const [customColorInput, setCustomColorInput] = useState("");
  const [sizeSelected, setSizeSelected] = useState([]);
  const [colorSelected, setColorSelected] = useState([]);

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
    setVariants([...variants, { type: "common", value: "" }]);
  }

  function removeVariant(index) {
    if (variants.length === 1) return;
    setVariants(variants.filter((_, i) => i !== index));
  }

  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];
  const colorNameMap = {
    red: "#EF4444",
    blue: "#3B82F6",
    green: "#22C55E",
    black: "#000000",
    white: "#FFFFFF",
    yellow: "#EAB308",
    purple: "#A855F7",
    pink: "#EC4899",
    orange: "#F97316",
    brown: "#92400E",
    grey: "#6B7280",
    gray: "#6B7280",
    navy: "#1E3A5F",
    beige: "#F5F5DC",
    cream: "#FFFDD0",
    maroon: "#800000",
    teal: "#14B8A6",
    gold: "#D4AF37",
    silver: "#C0C0C0",
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();

    for (let key in data) {
      if (key === "images") {
        for (let image of data.images) {
          formData.append("images", image);
        }
      } else if (key === "oldImages") {
        continue;
      } else {
        formData.append(key, data[key]);
      }
    }

    formData.append("oldImages", JSON.stringify(data.oldImages || []));
    formData.append("features", JSON.stringify(features.filter((f) => f.key)));
    const flatVariants = variants.filter((v) => v.value);
    const sizeVariants = sizeSelected.map((s) => ({ type: "size", value: s }));
    const colorVariants = colorSelected.map((c) => ({
      type: "color",
      value: c,
    }));
    formData.append(
      "variant",
      JSON.stringify([...sizeVariants, ...colorVariants, ...flatVariants]),
    );

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
        setVariants([]);
        setSizeSelected([]);
        setColorSelected([]);
        setImagePreviews([]);

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

    if (product.images?.length) {
      setImagePreviews(
        product.images.map((img) => ({ src: img, isNew: false })),
      );
    } else {
      setImagePreviews([]);
    }

    if (product.features?.length) {
      setFeatures(product.features);
    } else {
      setFeatures([{ key: "", value: "" }]);
    }

    const sizes = [];
    const colors = [];
    const other = [];

    if (product.variant?.length) {
      product.variant.forEach((v) => {
        const type =
          v.type ||
          (v.key === "size"
            ? "size"
            : v.key === "color"
              ? "color"
              : v.key
                ? "custom"
                : "common");
        if (type === "size") sizes.push(v.value || v.size);
        else if (type === "color") colors.push(v.value || v.color);
        else other.push(v);
      });
    }

    setSizeSelected(sizes);
    setColorSelected(colors);
    setVariants(other);

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

                <select
                  name="subcategory"
                  value={data.subcategory}
                  onChange={handleChange}
                >
                  <option value="">Select Sub Category</option>
                  {categories
                    .find((c) => c._id === data.category)
                    ?.subcategory?.map((sub, i) => (
                      <option key={i} value={sub}>
                        {sub}
                      </option>
                    ))}
                </select>
              </div>

              <div className={style.formRow}>
                <label>Product Images</label>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    setData({ ...data, images: [...data.images, ...files] });
                    const newPreviews = files.map((f) => ({
                      src: URL.createObjectURL(f),
                      isNew: true,
                    }));
                    setImagePreviews([...imagePreviews, ...newPreviews]);
                  }}
                />

                {imagePreviews.length > 0 && (
                  <div className={style.imagePreviewGrid}>
                    {imagePreviews.map((img, i) => (
                      <div key={i} className={style.imagePreviewItem}>
                        <img
                          src={img.isNew ? img.src : IMAGE_API + img.src}
                          alt=""
                        />
                        <button
                          type="button"
                          className={style.imagePreviewRemove}
                          onClick={() => {
                            if (img.isNew) {
                              const fileIndex = data.images.findIndex(
                                (f) => URL.createObjectURL(f) === img.src,
                              );
                              if (fileIndex > -1) {
                                const updated = [...data.images];
                                updated.splice(fileIndex, 1);
                                setData({ ...data, images: updated });
                              }
                            } else {
                              setData({
                                ...data,
                                oldImages: data.oldImages.filter(
                                  (o) => o !== img.src,
                                ),
                              });
                            }
                            setImagePreviews(
                              imagePreviews.filter((_, idx) => idx !== i),
                            );
                          }}
                        >
                          <RxCross2 />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={`${style.formRow} ${style.section}`}>
                <h3>Features</h3>
                {features.map((feature, index) => (
                  <div key={index} className={style.featureRow}>
                    <input
                      type="text"
                      placeholder="Key (e.g. Material)"
                      value={feature.key}
                      onChange={(e) =>
                        handleFeatureChange(index, "key", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g. Cotton)"
                      value={feature.value}
                      onChange={(e) =>
                        handleFeatureChange(index, "value", e.target.value)
                      }
                    />
                    <button type="button" onClick={addFeature}>
                      <FaPlus />
                    </button>
                    {features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        style={{ background: "#dc2626" }}
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className={`${style.formRow} ${style.section}`}>
                <h3>Sizes</h3>
                <div className={style.variantGroup}>
                  <div className={style.variantGroupChips}>
                    {sizeOptions.map((s) => {
                      const active = sizeSelected.includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          className={`${style.sizeChip} ${active ? style.sizeChipActive : ""}`}
                          onClick={() => {
                            setSizeSelected(
                              active
                                ? sizeSelected.filter((v) => v !== s)
                                : [...sizeSelected, s],
                            );
                          }}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                  <div className={style.variantGroupAdd}>
                    <input
                      type="text"
                      placeholder="Custom size"
                      value={customSizeInput}
                      onChange={(e) => setCustomSizeInput(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const val = customSizeInput.trim().toUpperCase();
                        if (val && !sizeSelected.includes(val)) {
                          setSizeSelected([...sizeSelected, val]);
                          setCustomSizeInput("");
                        }
                      }}
                    >
                      Add
                    </button>
                  </div>
                  {sizeSelected.length > 0 && (
                    <div className={style.variantGroupTags}>
                      {sizeSelected.map((s) => (
                        <span key={s} className={style.tag}>
                          {s}
                          <button
                            type="button"
                            onClick={() =>
                              setSizeSelected(
                                sizeSelected.filter((v) => v !== s),
                              )
                            }
                          >
                            <RxCross2 />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className={`${style.formRow} ${style.section}`}>
                <h3>Colors</h3>
                <div className={style.variantGroup}>
                  <div className={style.variantGroupChips}>
                    {Object.entries(colorNameMap).map(([name, hex]) => {
                      const active = colorSelected.includes(name);
                      return (
                        <button
                          key={name}
                          type="button"
                          className={`${style.colorChip} ${active ? style.colorChipActive : ""}`}
                          onClick={() => {
                            setColorSelected(
                              active
                                ? colorSelected.filter((v) => v !== name)
                                : [...colorSelected, name],
                            );
                          }}
                        >
                          <span
                            className={style.colorChipDot}
                            style={{ background: hex }}
                          />
                          {name}
                        </button>
                      );
                    })}
                  </div>
                  <div className={style.variantGroupAdd}>
                    <input
                      type="text"
                      placeholder="Custom color"
                      value={customColorInput}
                      onChange={(e) => setCustomColorInput(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const val = customColorInput.trim().toLowerCase();
                        if (val && !colorSelected.includes(val)) {
                          setColorSelected([...colorSelected, val]);
                          setCustomColorInput("");
                        }
                      }}
                    >
                      Add
                    </button>
                  </div>
                  {colorSelected.length > 0 && (
                    <div className={style.variantGroupTags}>
                      {colorSelected.map((c) => (
                        <span key={c} className={style.tag}>
                          <span
                            className={style.tagColorDot}
                            style={{ background: colorNameMap[c] || c }}
                          />
                          {c}
                          <button
                            type="button"
                            onClick={() =>
                              setColorSelected(
                                colorSelected.filter((v) => v !== c),
                              )
                            }
                          >
                            <RxCross2 />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className={`${style.formRow} ${style.section}`}>
                <h3>Other Variants</h3>
                {variants.length === 0 && (
                  <p className={style.emptyHint}>
                    No custom variants added yet
                  </p>
                )}
                {variants.map((variant, index) => (
                  <div key={index} className={style.variantRow}>
                    <select
                      value={variant.type}
                      onChange={(e) =>
                        handleVariantChange(index, "type", e.target.value)
                      }
                      className={style.variantTypeSelect}
                    >
                      <option value="common">Common</option>
                      <option value="custom">Custom</option>
                    </select>

                    {variant.type === "common" && (
                      <input
                        type="text"
                        placeholder="Value"
                        value={variant.value}
                        onChange={(e) =>
                          handleVariantChange(index, "value", e.target.value)
                        }
                      />
                    )}

                    {variant.type === "custom" && (
                      <div className={style.customRow}>
                        <input
                          type="text"
                          placeholder="Key (e.g. Material)"
                          value={variant.key}
                          onChange={(e) =>
                            handleVariantChange(index, "key", e.target.value)
                          }
                        />
                        <div className={style.customValuesInput}>
                          <div className={style.customValueTags}>
                            {variant.value?.split(",").filter(Boolean).map((v, vi) => (
                              <span key={vi} className={style.customTag}>
                                {v.trim()}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const vals = variant.value.split(",").filter(Boolean);
                                    vals.splice(vi, 1);
                                    handleVariantChange(index, "value", vals.join(", "));
                                  }}
                                >
                                  <RxCross2 />
                                </button>
                              </span>
                            ))}
                          </div>
                          <input
                            type="text"
                            placeholder="Type and press comma or Enter to add"
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === ",") {
                                e.preventDefault();
                                const input = e.target;
                                const newVal = input.value.replace(",", "").trim();
                                if (newVal) {
                                  const existing = variant.value ? variant.value.split(",").map(s => s.trim()).filter(Boolean) : [];
                                  handleVariantChange(index, "value", [...existing, newVal].join(", "));
                                }
                                input.value = "";
                              }
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <button type="button" onClick={addVariant}>
                      <FaPlus />
                    </button>
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        style={{ background: "#dc2626" }}
                      >
                        <FaTrash />
                      </button>
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
              <button
                className={style.editBtn}
                onClick={() => editProduct(product)}
              >
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
