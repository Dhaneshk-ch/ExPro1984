import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";
import apiClient from "../../utils/apiClient";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const categories = [
    "Electronics",
    "Clothing",
    "Books",
    "Home",
    "Sports",
    "Food",
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/products?limit=100");
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      alert("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await apiClient.delete(`/products/${productId}`);
      setProducts(products.filter((p) => p._id !== productId));
      setDeleteConfirm(null);
      alert("Product deleted successfully");
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product");
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      !categoryFilter || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <AdminNavbar>
      {/* Page Header */}
      <div className="admin-header">
        <div>
          <h1>Product Management</h1>
          <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
            Manage all products in your inventory
          </p>
        </div>
        <div className="admin-header-actions">
          <Link to="/admin/add-product" className="btn btn-success" style={{fontSize:'14px',padding:'10px 16px'}}>
            ➕ Add New Product
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        background: '#fff',
        borderRadius: '10px',
        padding: '16px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(17,24,39,0.06)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px'
      }}>
        <div>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '600',
            marginBottom: '6px',
            color: '#374151'
          }}>
            Search Products
          </label>
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '13px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '600',
            marginBottom: '6px',
            color: '#374151'
          }}>
            Filter by Category
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '13px',
              boxSizing: 'border-box'
            }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div style={{display:'flex',alignItems:'flex-end',gap:'8px'}}>
          <button
            onClick={() => { setSearchTerm(""); setCategoryFilter(""); }}
            style={{
              padding: '8px 16px',
              background: '#6b7280',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              transition: 'background 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#4b5563'}
            onMouseLeave={(e) => e.target.style.background = '#6b7280'}
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', paddingTop: '48px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#6b7280' }}>Loading products...</p>
        </div>
      ) : (
        <div className="admin-table-card">
          <div style={{padding:'20px',borderBottom:'1px solid #e5e7eb'}}>
            <h3 style={{margin:'0',fontSize:'16px',fontWeight:'700'}}>
              Products ({filteredProducts.length})
            </h3>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📦</div>
              <div className="empty-state-text">No products found</div>
              <p style={{fontSize:'12px',color:'#9ca3af'}}>
                {searchTerm || categoryFilter
                  ? "Try adjusting your filters"
                  : "Create your first product to get started"}
              </p>
              <Link to="/admin/add-product" className="btn btn-success" style={{marginTop:'12px'}}>
                ➕ Add Product
              </Link>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <div style={{fontWeight:'600'}}>{product.name}</div>
                        <div style={{fontSize:'12px',color:'#6b7280',marginTop:'4px'}}>
                          {product.description?.substring(0, 50)}...
                        </div>
                      </td>
                      <td>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          background: '#f0f0f0',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#374151'
                        }}>
                          {product.category}
                        </span>
                      </td>
                      <td style={{fontWeight:'600',color:'var(--success)'}}>
                        ₹{product.price.toLocaleString('en-IN')}
                      </td>
                      <td>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          background: product.stock > 10 ? '#d1fae5' : '#fee2e2',
                          color: product.stock > 10 ? '#065f46' : '#991b1b',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {product.stock} units
                        </span>
                      </td>
                      <td>
                        <span style={{color:'#f59e0b',fontSize:'18px'}}>
                          {'⭐'.repeat(Math.round(product.rating || 4))}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Link
                            to={`/admin/edit-product/${product._id}`}
                            className="btn btn-sm"
                            style={{
                              background: 'var(--primary)',
                              color: '#fff',
                              padding: '6px 12px',
                              fontSize: '12px',
                              textDecoration: 'none',
                              display: 'inline-block'
                            }}
                          >
                            ✏️ Edit
                          </Link>
                          <button
                            onClick={() => setDeleteConfirm(product._id)}
                            className="btn btn-sm"
                            style={{
                              background: 'var(--danger)',
                              color: '#fff',
                              padding: '6px 12px',
                              fontSize: '12px',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            🗑️ Delete
                          </button>
                        </div>

                        {deleteConfirm === product._id && (
                          <div style={{
                            position: 'fixed',
                            inset: '0',
                            background: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: '1000'
                          }}>
                            <div style={{
                              background: '#fff',
                              borderRadius: '10px',
                              padding: '24px',
                              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                              maxWidth: '400px'
                            }}>
                              <h3 style={{margin:'0 0 12px 0',color:'#111'}}>Delete Product?</h3>
                              <p style={{color:'#6b7280',margin:'0 0 20px 0',fontSize:'14px'}}>
                                This action cannot be undone. Are you sure you want to delete "{product.name}"?
                              </p>
                              <div style={{display:'flex',gap:'12px'}}>
                                <button
                                  onClick={() => handleDelete(product._id)}
                                  className="btn btn-danger"
                                  style={{flex:'1',padding:'10px 16px'}}
                                >
                                  Yes, Delete
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className="btn"
                                  style={{flex:'1',padding:'10px 16px',background:'#e5e7eb',color:'#111'}}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </AdminNavbar>
  );
};

export default AdminProducts;
