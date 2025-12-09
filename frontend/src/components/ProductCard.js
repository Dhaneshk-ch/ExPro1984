import React from 'react';
import { Link } from 'react-router-dom';
import categoryImages from "../utils/categoryImages";

const ProductCard = ({ product }) => {
  const finalImage =
    categoryImages[product.category?.toLowerCase()] ||
    product.imageUrl ||
    "https://via.placeholder.com/300";

  return (
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
          src={finalImage}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
        />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {product.category && (
          <span style={{
            display: 'inline-block',
            fontSize: '12px',
            color: '#6b7280',
            backgroundColor: '#f3f4f6',
            padding: '4px 8px',
            borderRadius: '4px',
            marginBottom: '8px'
          }}>
            {product.category}
          </span>
        )}

        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          marginBottom: '8px',
          color: '#111827',
          lineHeight: '1.4',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {product.name}
        </h3>

        <p style={{
          fontSize: '13px',
          color: '#6b7280',
          marginBottom: '12px'
        }}>
          {product.description}
        </p>

        <div style={{
          fontSize: '20px',
          fontWeight: '700',
          color: 'var(--primary)',
          marginBottom: '12px'
        }}>
          ₹{product.price}
        </div>

        <button className="btn" style={{ width: '100%' }}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
