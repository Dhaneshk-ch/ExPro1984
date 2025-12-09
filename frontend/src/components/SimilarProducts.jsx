/**
 * Similar Products Component
 * Displays products similar to the current product
 */

import React, { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";
import ProductCard from "./ProductCard";

const SimilarProducts = ({ productId, limit = 5 }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (productId) {
      fetchSimilarProducts();
    }
  }, [productId]);

  const fetchSimilarProducts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        `/ml/recommendations/similar/${productId}?top_k=${limit}`
      );
      setProducts(response.data.similar || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching similar products:", err);
      setError("Failed to fetch similar products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="center-spinner">Loading...</div>;
  if (error || !products || products.length === 0) return null;

  return (
    <div className="card" style={{marginTop:24}}>
      <h3 className="section-title">🔍 Similar Products You Might Like</h3>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.productId || product._id}>
            <ProductCard product={{ _id: product.productId, ...product }} />
            {product.similarity !== undefined && (
              <div className="match-badge">{(product.similarity * 100).toFixed(0)}% similar</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarProducts;
