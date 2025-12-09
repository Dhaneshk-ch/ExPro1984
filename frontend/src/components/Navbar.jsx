// Navbar Component
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin } =
    useContext(AuthContext);
  const { cartCount } = useContext(CartContext);

  return (
    <nav className="navbar">
      <div className="container nav-inner">
        {/* Logo */}
        <Link to="/" className="brand">
          <span>🛍️</span>
          <span>ExPro</span>
        </Link>

        {/* Center Links */}
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/image-search">🖼️ Image Search</Link>
          {isAdmin && <Link to="/admin/dashboard">Admin</Link>}
        </div>

        {/* Right Section */}
        <div className="nav-actions">
          {!isAdmin && (
            <Link to="/cart" title="View cart">
              <span className="cart-emoji">🛒</span>
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
          )}

          {!isAuthenticated ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <div className="auth-area">
              <span className="greeting">Hi, {user?.name}</span>
              <button onClick={logout} className="btn" style={{background:'#dc2626'}}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
