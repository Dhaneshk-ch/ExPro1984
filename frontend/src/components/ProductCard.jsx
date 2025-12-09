import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => (
  <div className="card" style={{
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
    transition: 'box-shadow 0.3s ease, transform 0.3s ease',
    cursor: 'pointer'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.boxShadow = '0 12px 24px rgba(17,24,39,0.15)';
    e.currentTarget.style.transform = 'translateY(-4px)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.boxShadow = '0 6px 18px rgba(17,24,39,0.06)';
    e.currentTarget.style.transform = 'translateY(0)';
  }}>
    {/* Product Image */}
    <div style={{
      width: '100%',
      height: '200px',
      overflow: 'hidden',
      marginBottom: '16px',
      borderRadius: '8px',
      background: '#f3f4f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <img
        src={product.imageUrl}
        alt={product.name}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.3s ease'
        }}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
      />
    </div>

    {/* Product Info */}
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Category Badge */}
      {product.category && (
        <span style={{
          display: 'inline-block',
          fontSize: '12px',
          color: '#6b7280',
          backgroundColor: '#f3f4f6',
          padding: '4px 8px',
          borderRadius: '4px',
          marginBottom: '8px',
          width: 'fit-content'
        }}>
          {product.category}
        </span>
      )}

      {/* Product Name */}
      <h3 style={{
        fontSize: '16px',
        fontWeight: '600',
        marginBottom: '8px',
        color: '#111827',
        lineHeight: '1.4',
        minHeight: '40px',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {product.name}
      </h3>

      {/* Product Description */}
      {product.description && (
        <p style={{
          fontSize: '13px',
          color: '#6b7280',
          marginBottom: '12px',
          lineHeight: '1.4',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {product.description}
        </p>
      )}

      {/* Stock Badge */}
      {product.stock !== undefined && (
        <div style={{
          fontSize: '12px',
          marginBottom: '12px',
          color: product.stock > 0 ? '#16a34a' : '#dc2626'
        }}>
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </div>
      )}

      {/* Price */}
      <div style={{
        fontSize: '20px',
        fontWeight: '700',
        color: 'var(--primary)',
        marginBottom: '12px'
      }}>
        ₹{product.price?.toLocaleString('en-IN') || 'N/A'}
      </div>

      {/* Add to Cart Button */}
      <button
        className="btn"
        style={{
          marginTop: 'auto',
          width: '100%',
          textAlign: 'center',
          opacity: product.stock > 0 ? 1 : 0.5,
          cursor: product.stock > 0 ? 'pointer' : 'not-allowed'
        }}
        disabled={product.stock <= 0}
      >
        {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  </div>
);

export default ProductCard;
