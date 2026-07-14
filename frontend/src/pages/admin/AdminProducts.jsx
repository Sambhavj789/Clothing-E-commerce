import style from "./AdminProducts.module.css";
import productCSS from "../Products.module.css";
import { AiFillDelete } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
function AdminProducts() {
  let product = {
    title: "Demo Products",
    _id: 1,
    images: [
      "https://pitshirts.in/cdn/shop/files/InShot-20241209_144744296.jpg?v=1755319164&width=1946",
    ],
    price: 10000,
  };

  return (
    <section className={style.adminProducts}>
      <div className={style.addProductOverlay}>
        <form className={style.addProductForm}>
          <div className={style.addProductHeader}>
            <h1>Add Product</h1>
            <RxCross2 className={style.closeButton} />
          </div>

          <div className={style.formBody}>
            <div className={style.formRow}>
              <label>Name</label>
              <input type="text" />
            </div>
            <div className={style.formRow}>
              <label>Name</label>
              <input type="text" />
            </div>
            <div className={style.formRow}>
              <label>Name</label>
              <input type="text" />
            </div>
            <div className={style.formRow}>
              <label>Name</label>
              <input type="text" />
            </div>
            <div className={style.formRow}>
              <label>Name</label>
              <input type="text" />
            </div>
            <div className={style.formRow}>
              <label>Name</label>
              <input type="text" />
            </div>
            <div className={style.formRow}>
              <label>Name</label>
              <input type="text" />
            </div>
            <div className={style.formRow}>
              <label>Name</label>
              <input type="text" />
            </div>
            <div className={style.formRow}>
              <label>Name</label>
              <input type="text" />
            </div>
          </div>
        </form>
      </div>

      <div className={style.adminProductsHeader}>
        <h1>Admin Products</h1>
        <button>Add Product</button>
      </div>

      {/* Products */}
      <div className={productCSS["product-grid"]}>
        <div key={product?._id} className={productCSS["product-card"]}>
          <div className={productCSS["image-wrapper"]}>
            <img src={product?.images?.[0]} alt={product?.title} />

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
      </div>
    </section>
  );
}

export default AdminProducts;
