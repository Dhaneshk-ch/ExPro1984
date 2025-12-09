import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";
import apiClient from "../../utils/apiClient";

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Electronics",
    stock: "",
    image: null,
  });

  const categories = [
    "Electronics",
    "Clothing",
    "Books",
    "Home",
    "Sports",
    "Food",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });

      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("stock", formData.stock);

      if (formData.image) {
        data.append("image", formData.image);
      }

      await apiClient.post("/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product added successfully!");
      navigate("/admin/products");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add product. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminNavbar>
      {/* Page Header */}
      <div className="admin-header">
        <div>
          <h1>Add New Product</h1>
          <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
            Create a new product in your inventory
          </p>
        </div>
        <div className="admin-header-actions">
          <Link to="/admin/products" className="btn" style={{fontSize:'14px',padding:'10px 16px',background:'#6b7280',color:'#fff',textDecoration:'none'}}>
            ← Back to Products
          </Link>
        </div>
      </div>

      {/* Form Card */}
      <div style={{
        background: '#fff',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(17,24,39,0.06)',
        maxWidth: '600px',
        marginBottom: '28px'
      }}>
        <form onSubmit={handleSubmit} className="admin-form" style={{padding:'28px'}}>
          {/* Error Message */}
          {error && (
            <div style={{
              background: '#fee2e2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              padding: '12px 16px',
              borderRadius: '6px',
              marginBottom: '20px',
              fontSize: '13px',
              fontWeight: '500'
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Product Name */}
          <div className="form-group">
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '8px',
              color: '#111'
            }}>
              Product Name <span style={{color: 'var(--danger)'}}>*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="E.g., Wireless Headphones"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s'
              }}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '8px',
              color: '#111'
            }}>
              Description <span style={{color: 'var(--danger)'}}>*</span>
            </label>
            <textarea
              name="description"
              rows="4"
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your product in detail..."
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                transition: 'border-color 0.3s',
                resize: 'vertical'
              }}
            ></textarea>
          </div>

          {/* Price & Category Grid */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'16px'}}>
            {/* Price */}
            <div className="form-group">
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#111'
              }}>
                Price (₹) <span style={{color: 'var(--danger)'}}>*</span>
              </label>
              <input
                type="number"
                name="price"
                required
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Category */}
            <div className="form-group">
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#111'
              }}>
                Category <span style={{color: 'var(--danger)'}}>*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  background: '#fff',
                  cursor: 'pointer'
                }}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stock */}
          <div className="form-group">
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '8px',
              color: '#111'
            }}>
              Stock Quantity <span style={{color: 'var(--danger)'}}>*</span>
            </label>
            <input
              type="number"
              name="stock"
              required
              value={formData.stock}
              onChange={handleChange}
              placeholder="0"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '8px',
              color: '#111'
            }}>
              Product Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '13px',
                boxSizing: 'border-box',
                background: '#fafafa',
                cursor: 'pointer'
              }}
            />

            {imagePreview && (
              <div style={{marginTop:'12px'}}>
                <p style={{fontSize:'12px',fontWeight:'600',color:'#6b7280',marginBottom:'8px'}}>
                  Preview:
                </p>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    maxWidth: '200px',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    border: '2px solid #e5e7eb'
                  }}
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: '1px solid #e5e7eb'
          }}>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-success"
              style={{
                flex: '1',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '600',
                opacity: loading ? '0.6' : '1',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s'
              }}
            >
              {loading ? '⏳ Adding...' : '✅ Add Product'}
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              style={{
                flex: '1',
                padding: '12px 20px',
                background: '#e5e7eb',
                color: '#111',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#d1d5db'}
              onMouseLeave={(e) => e.target.style.background = '#e5e7eb'}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminNavbar>
  );
};

export default AddProduct;
