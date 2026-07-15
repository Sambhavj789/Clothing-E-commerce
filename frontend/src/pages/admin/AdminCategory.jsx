import "./AdminCategory.css";
import { RxCross2 } from "react-icons/rx";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import api from "../../utils/api";

const categories = [
  {
    _id: "1",
    name: "Men",
    icon: "👔",
    subcategory: ["T-Shirts", "Shirts", "Jeans", "Hoodies", "Jackets"],
    createdAt: "14 Jul 2026",
  },
  {
    _id: "2",
    name: "Women",
    icon: "👗",
    subcategory: ["Dresses", "Tops", "Kurtis", "Jeans", "Skirts"],
    createdAt: "13 Jul 2026",
  },
  {
    _id: "3",
    name: "Kids",
    icon: "🧒",
    subcategory: ["Boys Wear", "Girls Wear", "Baby Clothing", "School Wear"],
    createdAt: "12 Jul 2026",
  },
];

function AdminCategory() {
  const [data, setData] = useState({
    name: "",
    icon: "",
    subcategory: "",
  });

  const [categories, setCategories] = useState([]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const newData = { ...data, subcategory: data.subcategory.split(",") };
    const response = await api.post("/category", newData);
    const res = response.data;
    if (res?.success) {
      alert("Category Added!");
      setIsMenuOpen(false);
      setData({ name: "", icon: "", subcategory: "" });
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
  useEffect(() => {
    getData();
  }, []);

  return (
    <section className="adminCategory">
      {/* Add Category Modal */}

      {isMenuOpen && (
        <div className="categoryOverlay">
          <form className="categoryForm">
            <div className="categoryHeader">
              <h2>Add Category</h2>

              <RxCross2
                className="closeBtn"
                onClick={() => setIsMenuOpen(false)}
              />
            </div>

            <div className="categoryBody">
              <div className="formRow">
                <label>Category Name</label>
                <input
                  type="text"
                  placeholder="Category Name"
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                />
              </div>

              <div className="formRow">
                <label>Icon</label>
                <input
                  type="text"
                  placeholder="🛋️ or Icon URL"
                  name="icon"
                  value={data.icon}
                  onChange={handleChange}
                />
              </div>

              <div className="formRow">
                <label>Sub Categories</label>

                <textarea
                  rows="5"
                  placeholder="One sub category per line"
                  name="subcategory"
                  value={data.subcategory}
                  onChange={handleChange}
                ></textarea>
              </div>

              <button className="submitBtn" onClick={handleSubmit}>
                Add Category
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Header */}

      <div className="categoryTop">
        <h1>Categories</h1>

        <button onClick={() => setIsMenuOpen(true)}>Add Category</button>
      </div>

      {/* Table */}

      <div className="tableWrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Icon</th>
              <th>Sub Categories</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id}>
                <td>{cat.name}</td>

                <td className="iconCell">{cat.icon}</td>

                <td>{cat.subcategory.join(", ")}</td>

                <td>{cat.createdAt}</td>

                <td>
                  <button className="editBtn">
                    <FaEdit />
                  </button>

                  <button className="deleteBtn">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AdminCategory;
