// AdminNavbar Component
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminNavbar = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="admin-layout">
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
          style={{
            position: 'fixed',
            inset: '0',
            background: 'rgba(0,0,0,0.5)',
            zIndex: '99',
            display: 'none'
          }}
        >
          <style>{`.sidebar-overlay { display: block !important; }`}</style>
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}
        style={{
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        <div style={{padding:'20px 16px 16px'}}>
          <h2 style={{margin:'0 0 4px 0',fontSize:'18px',fontWeight:'700'}}>🏢 Admin</h2>
          <p style={{margin:'0',color:'#94a3b8',fontSize:'12px'}}>Welcome, {user?.name}</p>
        </div>
        
        <nav className="menu" style={{marginTop:'24px'}}>
          <Link to="/admin/dashboard" title="Dashboard" onClick={closeSidebar}>
            📊 Dashboard
          </Link>
          <Link to="/admin/products" title="View Products" onClick={closeSidebar}>
            📦 Products
          </Link>
          <Link to="/admin/add-product" title="Add New Product" onClick={closeSidebar}>
            ➕ Add Product
          </Link>
          <Link to="/admin/orders" title="View Orders" onClick={closeSidebar}>
            📋 Orders
          </Link>
        </nav>

        <div style={{marginTop:'auto',padding:'16px',borderTop:'1px solid rgba(255,255,255,0.06)'}}>
          <button
            onClick={() => {
              logout();
              closeSidebar();
            }}
            className="btn"
            style={{background:'var(--danger)',width:'100%',padding:'10px',marginTop:'0'}}
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Top Bar */}
        <div className="admin-topbar">
          <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
            <button
              onClick={toggleSidebar}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '8px',
                color: '#111827'
              }}
              title="Toggle Menu"
            >
              ☰
            </button>
            <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
              <span style={{fontSize:'20px'}}>🛍️</span>
              <h1 style={{margin:'0',fontSize:'18px',fontWeight:'700',color:'#111827'}}>ExPro</h1>
            </div>
          </div>
          <div className="user-info">
            <span>{user?.email}</span>
            <span>({user?.role})</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;

