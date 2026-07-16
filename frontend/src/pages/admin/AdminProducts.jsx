import style from "./AdminProducts.module.css";
import productCSS from "../Products.module.css";
import { AiFillDelete } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import { useState, useEffect } from "react";
import api from "../../utils/api";
function AdminProducts() {
  let product = {
    title: "Demo Products",
    _id: 1,
    images: [
      "https://pitshirts.in/cdn/shop/files/InShot-20241209_144744296.jpg?v=1755319164&width=1946",
    ],
    price: 10000,
  };
  let [productsData, setProductsData] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
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
  });

  const [categories, setCategories] = useState([]);

  function handleChange(e) {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    for (let key in data) {
      if (key == "images") {
        for (let image of data.images) {
          formData.append("images", image);
        }
      } else {
        formData.append(key, data[key]);
      }
    }

    const response = await api.post("/products", formData, {
      headers: undefined,
    });
    const res = response.data;
    if (res?.success) {
      alert("Product Added Successfully");
    }
  }

  async function getData() {
    const response = await api.get("/category");
    const res = response.data;
    if (res?.success) {
      console.log(res);
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

  return (
    <section className={style.adminProducts}>
      {isMenuOpen && (
        <div className={style.addProductOverlay}>
          <form className={style.addProductForm}>
            {/* Header */}
            <div className={style.addProductHeader}>
              <h1>Add Product</h1>
              <RxCross2
                className={style.closeButton}
                onClick={() => setIsMenuOpen(false)}
              />
            </div>

            <div className={style.formBody}>
              {/* Product Name */}
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

              {/* Description */}
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

              {/* Price */}
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

              {/* Discount */}
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

              {/* Stock */}
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

              {/* Category */}
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

              {/* Sub Category */}
              <div className={style.formRow}>
                <label>Sub Category</label>

                <input
                  type="text"
                  placeholder="Sub Category"
                  name="subcategoyr"
                  value={data.subcategory}
                  onChange={handleChange}
                />
              </div>

              {/* Images */}
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
              {/* Submit */}

              <input
                type="submit"
                className={style.submitBtn}
                onClick={handleSubmit}
                value="Add Product"
              />
            </div>
          </form>
        </div>
      )}

      <div className={style.adminProductsHeader}>
        <h1>Admin Products</h1>
        <button onClick={() => setIsMenuOpen(true)}>Add Product</button>
      </div>

      {/* Products */}
      <div className={productCSS["product-grid"]}>
        {productsData.map((product) => (
          <div key={product?._id} className={productCSS["product-card"]}>
            <div className={productCSS["image-wrapper"]}>
              <img src={IMAGE_API + product?.images?.[0]} alt={product?.title} />

              <button
                type="button"
                className={style.productDeleteBtn}
                aria-label="Delete"
              >
                <AiFillDelete className={style.deleteIcon} />
              </button>

              <button type="button" className={productCSS["quick-add-btn"]}>
                Edit
              </button>
            </div>

            <div className={productCSS["product-info"]}>
              <h2 className={productCSS["product-title"]}>{product?.title}</h2>
              <p className={productCSS["product-price"]}>
                ₹ {product.price.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AdminProducts;
