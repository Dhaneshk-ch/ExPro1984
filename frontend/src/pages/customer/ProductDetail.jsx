// ProductDetail.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../utils/apiClient";
import { CartContext } from "../../context/CartContext";
import SimilarProducts from "../../components/SimilarProducts";
import categoryImages from "../../utils/categoryImages";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await apiClient.get(`/products/${id}`);
        setProduct(response.data.product);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart(
      {
        id: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category,
      },
      quantity
    );

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    setQuantity(1);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "48px",
            height: "48px",
            border: "4px solid #e5e7eb",
            borderTop: "4px solid var(--primary)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 16px",
          }} />
          <p style={{ color: "var(--muted)" }}>Loading product...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container product-detail">
        <div style={{ background: "#fee2e2", border: "1px solid #fecaca", padding: "16px", borderRadius: "8px", marginBottom: "16px", color: "#991b1b" }}>
          {error}
        </div>
        <button onClick={() => navigate(-1)} className="btn">Go Back</button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container product-detail">
        <p style={{ textAlign: "center", color: "var(--muted)" }}>Product not found</p>
      </div>
    );
  }

  const finalImage = categoryImages[product.category?.toLowerCase()] || product.imageUrl || "https://via.placeholder.com/600x400";

  return (
    <div className="container product-detail">
      <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "var(--primary)", cursor: "pointer", fontSize: "16px", fontWeight: "600", marginBottom: "24px", padding: "0" }}>
        ← Back to Products
      </button>

      <div className="product-detail-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
        {/* Image */}
        <div className="product-image-wrapper" style={{ display: 'flex', justifyContent: 'center' }}>
          <img
            src={finalImage}
            alt={product.name}
            style={{
              maxWidth: '100%',
              width: '100%',
              height: 'auto',
              border: "2px solid #e5e7eb",
              borderRadius: "10px",
              padding: "4px",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Info */}
        <div className="product-info-wrapper">
          <div className="product-header">
            <span className="product-category-badge" style={{ display: 'inline-block', padding: '6px 10px', background: '#f3f4f6', borderRadius: 6, marginBottom: 10 }}>{product.category}</span>

            <h1 className="product-title" style={{ fontSize: 28, margin: '8px 0' }}>{product.name}</h1>

            <div className="product-rating" style={{ margin: '8px 0' }}>
              <span className="stars">★★★★★</span>
              <span className="review-count" style={{ marginLeft: 8 }}>({product.reviews?.length || 0} reviews)</span>
            </div>

            <div className="product-price" style={{ fontSize: 24, fontWeight: 700, marginTop: 8 }}>
              ₹{product.price?.toLocaleString("en-IN") || "N/A"}
            </div>
          </div>

          <p className="product-description" style={{ marginTop: 16, color: '#374151' }}>{product.description}</p>

          <div className={`product-stock ${product.stock <= 0 ? "out-of-stock" : ""}`} style={{ marginTop: 12 }}>
            {product.stock > 0 ? <>✓ {product.stock} in stock</> : <>✗ Out of stock</>}
          </div>

          {product.stock > 0 && (
            <div className="quantity-selector" style={{ marginTop: 16 }}>
              <label style={{ display: 'block', marginBottom: 8 }}>Quantity</label>
              <div className="quantity-controls" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button className="quantity-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <span className="quantity-display" style={{ padding: '6px 12px', border: '1px solid #e5e7eb' }}>{quantity}</span>
                <button className="quantity-btn" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
              </div>
            </div>
          )}

          <div className="product-actions" style={{ marginTop: 20, display: 'flex', gap: 12 }}>
            <button onClick={handleAddToCart} disabled={product.stock === 0} className="btn" style={{ background: addedToCart ? 'var(--success)' : 'var(--primary)', color: '#fff', padding: '10px 16px' }}>
              {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
            </button>

            <button onClick={handleBuyNow} disabled={product.stock === 0} className="btn buy-now" style={{ padding: '10px 16px' }}>
              Buy Now
            </button>
          </div>

          <div className="product-specs" style={{ marginTop: 20 }}>
            <div className="specs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
              <div className="spec-item">
                <span className="spec-label">Product ID</span>
                <div className="spec-value">{product._id.slice(-8).toUpperCase()}</div>
              </div>
              <div className="spec-item">
                <span className="spec-label">Category</span>
                <div className="spec-value">{product.category}</div>
              </div>
              <div className="spec-item">
                <span className="spec-label">Availability</span>
                <div className="spec-value" style={{ color: product.stock > 0 ? 'var(--success)' : 'var(--danger)' }}>
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </div>
              </div>
              <div className="spec-item">
                <span className="spec-label">Stock Count</span>
                <div className="spec-value">{product.stock} units</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "64px" }}>
        <SimilarProducts productId={id} limit={5} />
      </div>
    </div>
  );
};

export default ProductDetail;
