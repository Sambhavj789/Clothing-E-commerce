import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import "./Header.css";
function Header() {
  const navigate = useNavigate();
  return (
    <header>
      {/* Code for left side of header */}
      <div className="header-left">
        <h1 className="header-logo">Elite Attire</h1>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/products">Products</Link>
            </li>
            <li>
              <Link to="/about">About US</Link>
            </li>
            <li>
              <Link to="/contact">Contact US</Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Code for right side of header */}
      <div className="header-right">
        <div className="search">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search elite collections..." />
        </div>

        <button className="login-btn" onClick={() => navigate("/login")}>
          Login
        </button>
      </div>
    </header>
  );
}

export default Header;
