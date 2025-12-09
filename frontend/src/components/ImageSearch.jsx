/**
 * Image Search Component
 * Allows users to upload an image and search for similar products
 */

import React, { useState, useRef } from "react";
import apiClient from "../utils/apiClient";
import ProductCard from "./ProductCard";

const ImageSearch = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => setImagePreview(event.target.result);
    reader.readAsDataURL(file);
  };

  const handleSearch = async () => {
    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      setError("Please select an image");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post("/ml/image-search", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResults(response.data.results || []);
      setSuccess(`Found ${response.data.searchCount} similar products`);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to search by image"
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setImagePreview(null);
    setResults([]);
    setError(null);
    setSuccess(null);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="card" style={{maxWidth:720,margin:'24px auto',padding:24}}>
      <h2 className="section-title">🖼️ Search by Image</h2>
      <p style={{color:'#6b7280',marginBottom:18}}>Upload a product image to find similar items in our store.</p>

      {/* Image Upload Section */}
      <div className="mb-8">
        <div className="image-drop">
          {imagePreview ? (
            <div style={{textAlign:'center'}}>
              <img src={imagePreview} alt="Preview" style={{maxHeight:220,margin:'0 auto',borderRadius:8,boxShadow:'0 6px 18px rgba(2,6,23,0.08)'}} />
              <p style={{color:'#6b7280',marginTop:12}}>Image selected</p>
              <div style={{marginTop:12}}>
                <button onClick={() => fileInputRef.current.click()} className="btn" style={{marginRight:8}}>Change Image</button>
                <button onClick={handleClear} className="btn secondary">Clear</button>
              </div>
            </div>
          ) : (
            <div className="upload-placeholder" onClick={() => fileInputRef.current.click()} style={{cursor:'pointer',textAlign:'center'}}>
              <svg width="64" height="64" viewBox="0 0 48 48" fill="none" stroke="#60a5fa"><path d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-8-12v12m0 0l-3-3m3 3l3-3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <p style={{color:'#6b7280',marginTop:12}}>Click to upload or drag and drop</p>
              <p style={{color:'#9ca3af',fontSize:13}}>PNG, JPG, GIF up to 10 MB</p>
            </div>
          )}

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} style={{display:'none'}} />
        </div>
      </div>

      {error && <div style={{background:'#fff1f2',border:'1px solid #fecaca',padding:12,borderRadius:8,color:'#991b1b',marginBottom:12}}>{error}</div>}
      {success && <div style={{background:'#ecfdf5',border:'1px solid #bbf7d0',padding:12,borderRadius:8,color:'#065f46',marginBottom:12}}>✓ {success}</div>}

      {imagePreview && results.length === 0 && (
        <button onClick={handleSearch} disabled={loading} className="btn" style={{width:'100%'}}>{loading? 'Searching...':'Search Similar Products'}</button>
      )}

      {results.length > 0 && (
        <div>
          <h3 className="section-title">Similar Products ({results.length})</h3>
          <div className="product-grid">
            {results.map((product) => (
              <div key={product.productId}>
                <ProductCard product={{ _id: product.productId, ...product }} />
                {product.similarity !== undefined && <div className="match-badge">{(product.similarity * 100).toFixed(0)}% match</div>}
              </div>
            ))}
          </div>

          <button onClick={handleClear} className="btn secondary" style={{marginTop:18,width:'100%'}}>Search Again</button>
        </div>
      )}
    </div>
  );
};

export default ImageSearch;
