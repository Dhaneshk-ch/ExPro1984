// Cart.jsx
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import categoryImages from "../../utils/categoryImages";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, updateQuantity, removeFromCart, clearCart } =
    useContext(CartContext);

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: "48px 16px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 20 }}>
          Shopping Cart
        </h1>
        <div className="card" style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🛒</div>
          <p style={{ color: "#6b7280", fontSize: 18, marginBottom: 18 }}>
            Your cart is empty
          </p>
          <Link to="/products" className="btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "32px 16px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 20 }}>
        Shopping Cart
      </h1>

      <div className="cart-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
        <div>
          <div className="card">
            <div style={{ borderBottom: "1px solid #eef2f7", paddingBottom: 12 }}>
              <p style={{ fontWeight: 700 }}>
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
              </p>
            </div>

            <div style={{ marginTop: 12 }}>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="cart-item"
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 12,
                    display: 'flex',
                    gap: 12,
                    alignItems: 'center'
                  }}
                >
                  <img
                    src={
                      categoryImages[item.category?.toLowerCase()] ||
                      item.imageUrl ||
                      "https://via.placeholder.com/150"
                    }
                    alt={item.name}
                    style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }}
                  />

                  <div style={{ flex: 1 }}>
                    <Link to={`/product/${item.id}`} style={{ fontWeight: 700, color: "#111827" }}>
                      {item.name}
                    </Link>

                    <div style={{ color: "var(--success)", fontWeight: 700, marginTop: 6 }}>
                      ₹{item.price}
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                    <div className="qty-control" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="btn ghost">-</button>

                      <div style={{ padding: "6px 12px", border: "1px solid #eef2f7" }}>{item.quantity}</div>

                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="btn ghost">+</button>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: "#6b7280" }}>Subtotal</div>
                      <div style={{ fontWeight: 700 }}>₹{item.price * item.quantity}</div>
                    </div>

                    <button onClick={() => removeFromCart(item.id)} className="btn ghost" style={{ color: "var(--danger)" }}>Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid #eef2f7", padding: 12, textAlign: "right" }}>
              <button onClick={clearCart} className="btn ghost" style={{ color: "var(--danger)" }}>Clear Cart</button>
            </div>
          </div>
        </div>

        <div>
          <div className="card" style={{ position: 'sticky', top: 20 }}>
            <h2 style={{ fontWeight: 700, marginBottom: 12 }}>Order Summary</h2>

            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Subtotal</span>
                <span>₹{totalPrice}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--success)" }}>
                <span>Shipping</span>
                <span>FREE</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Tax (0%)</span>
                <span>₹0</span>
              </div>
            </div>

            <div style={{ borderTop: "1px solid #eef2f7", paddingTop: 12, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                <span>Total</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>

            <button onClick={() => navigate("/checkout")} className="btn" style={{ width: "100%", marginBottom: 8 }}>Proceed to Checkout</button>
            <button onClick={() => navigate("/products")} className="btn secondary" style={{ width: "100%" }}>Continue Shopping</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
