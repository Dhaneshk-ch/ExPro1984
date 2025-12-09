import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";
import apiClient from "../../utils/apiClient";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
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

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await apiClient.get(`/products/${id}`);
      const p = res.data.product;

      setFormData({
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category,
        stock: p.stock,
        image: null,
      });

      setImagePreview(p.imageUrl);
    } catch (err) {
      setError("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    setError(null);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) data.append(key, formData[key]);
      });

      await apiClient.put(`/products/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product updated successfully!");
      navigate("/admin/products");
    } catch (err) {
      setError("Failed to update product");
    }
  };

  if (loading) return <AdminNavbar><p style={{padding:"20px"}}>Loading product...</p></AdminNavbar>;

  return (
    <AdminNavbar>
      <div className="admin-header">
        <div>
          <h1>Edit Product</h1>
          <p style={{ color: "#6b7280" }}>Update product information</p>
        </div>
        <Link to="/admin/products" className="btn btn-secondary">
          ← Back
        </Link>
      </div>

      <div className="admin-form-card">
        <form onSubmit={handleSubmit}>
          {error && <p className="error-box">{error}</p>}

          <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />

          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required />

          <label>Price (₹)</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} required />

          <label>Category</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>

          <label>Stock</label>
          <input type="number" name="stock" value={formData.stock} onChange={handleChange} required />

          <label>Replace Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                marginTop: "10px",
                width: "200px",
                height: "150px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          )}

          <button className="btn btn-success" type="submit">
            Save Changes
          </button>
        </form>
      </div>
    </AdminNavbar>
  );
};

export default EditProduct;
