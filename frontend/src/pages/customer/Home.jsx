// Home Page
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../utils/apiClient";
import ProductCard from "../../components/ProductCard";
import ProductRecommendations from "../../components/ProductRecommendations";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await apiClient.get("/products?limit=6");
        setProducts(response.data.products);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={{background:'linear-gradient(90deg,#2563eb,#7c3aed)',color:'#fff',padding:'56px 0'}}>
        <div className="container" style={{textAlign:'center'}}>
          <h1 style={{fontSize:36,fontWeight:700,marginBottom:8}}>Welcome to ExPro</h1>
          <p style={{fontSize:18,marginBottom:18}}>Shop the best products at unbeatable prices</p>
          <Link to="/products" className="btn">Start Shopping</Link>
        </div>
      </section>

      {/* Categories Section */}
      <section style={{padding:'32px 0',background:'#f8fafc'}}>
        <div className="container">
          <h2 className="section-title" style={{textAlign:'center',marginBottom:18}}>Shop by Category</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:12}}>
            {["Electronics","Clothing","Books","Home","Sports","Food"].map(cat=> (
              <Link key={cat} to={`/products?category=${cat}`} className="card" style={{textAlign:'center',padding:16}}>
                <div style={{fontSize:28,marginBottom:8}}>{cat==='Electronics'?'📱':cat==='Clothing'?'👕':cat==='Books'?'📚':cat==='Home'?'🏠':cat==='Sports'?'⚽':'🍔'}</div>
                <h3 style={{fontWeight:700}}>{cat}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{padding:'40px 0'}}>
        <div className="container">
          <h2 className="section-title" style={{textAlign:'center',marginBottom:18}}>Featured Products</h2>
          {loading ? (
            <div style={{textAlign:'center',padding:40}}>Loading products...</div>
          ) : error ? (
            <div style={{background:'#fff1f2',border:'1px solid #fecaca',padding:12,borderRadius:8}}>{error}</div>
          ) : (
            <div className="product-grid">
              {products.map(product=> <ProductCard key={product._id} product={product} />)}
            </div>
          )}

          <div style={{textAlign:'center',marginTop:20}}>
            <Link to="/products" className="btn">View All Products</Link>
          </div>
        </div>
      </section>

      {/* Recommendations */}
      <section style={{padding:'24px 0',background:'#ffffff'}}>
        <div className="container">
          <ProductRecommendations limit={10} />
        </div>
      </section>

      {/* Features Section */}
      <section style={{background:'#f8fafc',padding:'24px 0'}}>
        <div className="container">
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:18,textAlign:'center'}}>
            <div><div style={{fontSize:32}}>🚚</div><h3 style={{fontWeight:700}}>Free Shipping</h3><p style={{color:'#6b7280'}}>On all orders above ₹500</p></div>
            <div><div style={{fontSize:32}}>💳</div><h3 style={{fontWeight:700}}>Secure Payment</h3><p style={{color:'#6b7280'}}>100% safe and encrypted</p></div>
            <div><div style={{fontSize:32}}>↩️</div><h3 style={{fontWeight:700}}>Easy Returns</h3><p style={{color:'#6b7280'}}>30-day return policy</p></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
