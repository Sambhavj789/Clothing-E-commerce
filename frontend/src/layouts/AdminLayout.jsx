import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaBox, FaShoppingCart, FaTags, FaSignOutAlt, FaTachometerAlt, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import style from "./AdminLayout.module.css";
import { useUser } from "../context/UserContext";

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const links = [
    { to: "/admin/products", label: "Products", icon: <FaBox /> },
    { to: "/admin/orders", label: "Orders", icon: <FaShoppingCart /> },
    { to: "/admin/category", label: "Category", icon: <FaTags /> },
  ];

  async function handleLogout() {
    const isSuccess = await logout();
    if (isSuccess) {
      navigate("/login");
    }
  }

  return (
    <section className={`${style.adminLayout} ${!sidebarOpen ? style.collapsed : ""}`}>
      <div className={`${style.adminSidebar} ${!sidebarOpen ? style.sidebarCollapsed : ""}`}>
        <div className={style.sidebarHeader}>
          <h2 className={style.sidebarTitle}>Elite Attire</h2>
          <button className={style.toggleBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <div className={style.adminLinks}>
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`${style.sidebarLink} ${location.pathname === link.to ? style.active : ""}`}
            >
              <span className={style.linkIcon}>{link.icon}</span>
              <span className={style.linkLabel}>{link.label}</span>
            </Link>
          ))}
        </div>

        <div className={style.sidebarFooter}>
          <div className={style.adminInfo}>
            <span className={style.adminName}>{user?.name || "Admin"}</span>
          </div>
          <button className={style.logoutBtn} onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      <div className={style.adminContent}>
        <Outlet />
      </div>
    </section>
  );
}

export default AdminLayout;
