// Products Page
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import apiClient from "../../utils/apiClient";
import ProductCard from "../../components/ProductCard";

const Products = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
  });

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get("/products/categories");
        setCategories(response.data.categories);
      } catch (err) {
        console.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();

        if (filters.search) params.append("search", filters.search);
        if (filters.category) params.append("category", filters.category);
        if (filters.minPrice) params.append("minPrice", filters.minPrice);
        if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);

        const response = await apiClient.get(`/products?${params.toString()}`);
        setProducts(response.data.products);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFilters({
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Already handled by useEffect
  };

  return (
    <div className="products-page container">
      {/* Header */}
      <div className="products-header">
        <h1>Products</h1>
        <p className="products-count">{products.length} items found</p>
      </div>

      {/* Horizontal Filter Bar */}
      <div className="filter-bar">
        <form onSubmit={handleSearch}>
          <div className="filter-bar-inner">
            {/* Search Input */}
            <div className="filter-group" style={{ flex: 2, minWidth: '220px' }}>
              <label>Search</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                placeholder="Search products..."
                onChange={handleFilterChange}
              />
            </div>

            {/* Category Select */}
            <div className="filter-group">
              <label>Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Price */}
            <div className="filter-group">
              <label>Min Price</label>
              <input
                type="number"
                name="minPrice"
                placeholder="₹0"
                value={filters.minPrice}
                onChange={handleFilterChange}
              />
            </div>

            {/* Max Price */}
            <div className="filter-group">
              <label>Max Price</label>
              <input
                type="number"
                name="maxPrice"
                placeholder="₹50000"
                value={filters.maxPrice}
                onChange={handleFilterChange}
              />
            </div>

            {/* Action Buttons */}
            <div className="filter-actions">
              <button type="submit" className="btn" style={{ minWidth: '100px' }}>
                Search
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="btn secondary"
                style={{ minWidth: '100px' }}
              >
                Reset
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="center-spinner" style={{ minHeight: '400px' }}>
          <div>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid #e5e7eb',
              borderTop: '4px solid var(--primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <p style={{ color: 'var(--muted)' }}>Loading products...</p>
          </div>
        </div>
      ) : error ? (
        <div style={{
          background: '#fee2e2',
          border: '1px solid #fecaca',
          padding: '16px',
          borderRadius: '8px',
          color: '#991b1b',
          textAlign: 'center'
        }}>
          {error}
        </div>
      ) : products.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '48px 16px',
          background: 'var(--bg)',
          borderRadius: '8px',
          color: 'var(--muted)'
        }}>
          <p style={{ fontSize: '18px', margin: '0' }}>
            No products found matching your filters.
          </p>
          <p style={{ fontSize: '14px', marginTop: '8px' }}>
            Try adjusting your search criteria.
          </p>
        </div>
      ) : (
        <div className="products-content">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
