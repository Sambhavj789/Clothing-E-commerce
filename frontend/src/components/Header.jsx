import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaUserCircle, FaUserShield, FaShoppingCart, FaShoppingBag, FaBars, FaTimes } from "react-icons/fa";
import "./Header.css";
import { useUser } from "../context/UserContext";
import toast from "react-hot-toast";
import api from "../utils/api";

function Header() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (!user) { setCartCount(0); return; }
    api.get("/cart").then((res) => {
      if (res.data?.success) setCartCount(res.data.data.length);
    }).catch(() => {});
  }, [user]);

  async function handleLogout() {
    const isSuccess = await logout();
    if (isSuccess) {
      toast.success("Logout Successfully");
      navigate("/login");
    }
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleNav(path) {
    navigate(path);
    closeMenu();
  }

  return (
    <header>
      <div className="header-left">
        <Link to="/" className="header-logo" onClick={closeMenu}>Elite Attire</Link>

        <nav className="desktop-nav">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </nav>
      </div>

      <div className="header-right">
        <div className="search">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search collections..." />
        </div>

        <button className="cart-btn" onClick={() => navigate("/cart")} aria-label="Cart">
          <FaShoppingCart />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>

        {!user ? (
          <button className="login-btn" onClick={() => navigate("/login")}>Login</button>
        ) : (
          <div className="user-menu">
            {user.role === "admin" ? (
              <>
                <button className="admin-btn" onClick={() => navigate("/admin")}>
                  <FaUserShield />
                  <span>Admin</span>
                </button>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <div className="profile-dropdown">
                <button className="profile-btn" onClick={() => setProfileOpen(!profileOpen)}>
                  {user.profilePic ? (
                    <img src={user.profilePic} alt="profile" className="profile-img" />
                  ) : (
                    <FaUserCircle className="profile-icon" />
                  )}
                </button>
                {profileOpen && (
                  <>
                    <div className="dropdown-backdrop" onClick={() => setProfileOpen(false)} />
                    <div className="dropdown-menu">
                      <div className="dropdown-user">{user.name || "User"}</div>
                      <button onClick={() => { setProfileOpen(false); navigate("/orders"); }}><FaShoppingBag /> My Orders</button>
                      <button onClick={() => { setProfileOpen(false); navigate("/profile"); }}><FaUserCircle /> Profile</button>
                      <hr />
                      <button className="dropdown-logout" onClick={handleLogout}>Logout</button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <div className={`mobile-overlay ${menuOpen ? "active" : ""}`} onClick={closeMenu} />
      <nav className={`mobile-nav ${menuOpen ? "active" : ""}`}>
        <div className="mobile-nav-header">
          <span className="mobile-nav-title">Menu</span>
          <button className="mobile-close" onClick={closeMenu}><FaTimes /></button>
        </div>
        <div className="mobile-search">
          <FaSearch />
          <input type="text" placeholder="Search collections..." />
        </div>
        <ul>
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/products" onClick={closeMenu}>Products</Link></li>
          <li><Link to="/about" onClick={closeMenu}>About Us</Link></li>
          <li><Link to="/contact" onClick={closeMenu}>Contact Us</Link></li>
          <li><Link to="/cart" onClick={closeMenu}>Cart {cartCount > 0 && `(${cartCount})`}</Link></li>
          {!user ? (
            <li><Link to="/login" onClick={closeMenu}>Login</Link></li>
          ) : (
            <>
              {user.role === "admin" && <li><Link to="/admin" onClick={closeMenu}>Admin Panel</Link></li>}
              <li><Link to="/orders" onClick={closeMenu}>My Orders</Link></li>
              <li><Link to="/profile" onClick={closeMenu}>Profile</Link></li>
              <li><button className="mobile-logout" onClick={handleLogout}>Logout</button></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
