/**
 * Product Recommendations Component
 * Displays personalized product recommendations for the user
 */

import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import apiClient from "../utils/apiClient";
import ProductCard from "./ProductCard";

const ProductRecommendations = ({ limit = 10 }) => {
  const { user } = useContext(AuthContext);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchRecommendations();
    }
  }, [user]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        `/ml/recommendations/user?top_k=${limit}`
      );
      setRecommendations(response.data.recommendations || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError("Failed to fetch recommendations");
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  if (loading) return <div className="center-spinner">Loading...</div>;
  if (error) return <div className="card" style={{border:'1px solid #fee2e2',color:'#991b1b'}}>{error}</div>;
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="card">
      <h2 className="section-title">✨ Recommended For You</h2>
      <div className="product-grid">
        {recommendations.slice(0, limit).map((product) => (
          <div key={product.productId || product._id}>
            <ProductCard product={{ _id: product.productId, ...product }} />
            {product.score !== undefined && (
              <div className="match-badge">{(product.score * 100).toFixed(0)}% match</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductRecommendations;
