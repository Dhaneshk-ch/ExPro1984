// Footer Component
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        {/* Top Footer Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '32px',
          marginBottom: '32px',
          paddingBottom: '32px',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          {/* About */}
          <div>
            <h3 className="footer-heading">🛍️ About ExPro</h3>
            <p className="footer-text">
              Your one-stop shop for quality products at amazing prices. We offer a wide selection of items across multiple categories.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-list">
              <li>
                <Link to="/products" className="footer-link">Shop All</Link>
              </li>
              <li>
                <Link to="/products?category=Electronics" className="footer-link">Electronics</Link>
              </li>
              <li>
                <Link to="/products?category=Clothing" className="footer-link">Clothing</Link>
              </li>
              <li>
                <Link to="/products?category=Books" className="footer-link">Books</Link>
              </li>
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h3 className="footer-heading">Customer Service</h3>
            <ul className="footer-list">
              <li><a href="#shipping" className="footer-link">Shipping Info</a></li>
              <li><a href="#returns" className="footer-link">Returns & Exchanges</a></li>
              <li><a href="#faq" className="footer-link">FAQs</a></li>
              <li><a href="#help" className="footer-link">Help Center</a></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="footer-heading">📞 Contact Us</h3>
            <ul className="footer-list">
              <li>
                <span style={{color:'#cbd5e1'}}>Email:</span>
                <br/>
                <span className="footer-accent">support@expro.com</span>
              </li>
              <li style={{marginTop:'12px'}}>
                <span style={{color:'#cbd5e1'}}>Phone:</span>
                <br/>
                <span className="footer-accent">+91-9887897889</span>
              </li>
              <li style={{marginTop:'12px'}}>
                <span style={{color:'#cbd5e1'}}>Hours:</span>
                <br/>
                <span className="footer-accent">Mon - Fri, 10 AM - 6 PM IST</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & Bottom */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          <div>
            <h3 className="footer-heading" style={{marginTop:'0'}}>Follow Us</h3>
            <div style={{display:'flex',gap:'12px'}}>
              <a href="#facebook" style={{fontSize:'20px',cursor:'pointer'}}>f</a>
              <a href="#twitter" style={{fontSize:'20px',cursor:'pointer'}}>𝕏</a>
              <a href="#instagram" style={{fontSize:'20px',cursor:'pointer'}}>📷</a>
              <a href="#linkedin" style={{fontSize:'20px',cursor:'pointer'}}>in</a>
            </div>
          </div>
          
          <div className="footer-bottom" style={{
            border: 'none',
            padding: '0',
            textAlign: 'center',
            margin: '0',
            flex: '1'
          }}>
            <p style={{margin:'0',fontSize:'14px',color:'#9ca3af'}}>
              &copy; {currentYear} <span className="footer-accent">ExPro</span>. All rights reserved.
            </p>
            <p style={{margin:'8px 0 0 0',fontSize:'12px',color:'#6b7280'}}>
              <a href="#privacy" style={{color:'inherit',textDecoration:'none',marginRight:'16px'}}>Privacy Policy</a>
              <a href="#terms" style={{color:'inherit',textDecoration:'none'}}>Terms of Service</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
