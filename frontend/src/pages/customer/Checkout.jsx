// Checkout.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import apiClient from "../../utils/apiClient";
import categoryImages from "../../utils/categoryImages";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useContext(CartContext);
  const { isAuthenticated, user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    paymentMethod: "razorpay",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const orderResponse = await apiClient.post("/orders/create", {
        shippingAddress: formData,
        paymentMethod: formData.paymentMethod,
        items: cartItems.map((ci) => ({
          productId: ci.id || ci._id || ci.productId,
          quantity: ci.quantity,
        })),
      });

      const order = orderResponse.data.order;

      if (formData.paymentMethod === "razorpay") {
        const rpResponse = await apiClient.post("/payment/create-order", {
          amount: totalPrice,
          orderId: order._id,
        });

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";

        script.onload = () => {
          if (!window.Razorpay) {
            setError("Payment gateway failed to load");
            return;
          }

          const options = {
            key: process.env.REACT_APP_RAZORPAY_KEY,
            amount: rpResponse.data.order.amount,
            currency: "INR",
            name: "ExPro",
            description: `Order #${order._id}`,
            order_id: rpResponse.data.order.id,

            handler: async function (response) {
              try {
                await apiClient.post("/payment/verify", {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderId: order._id,
                });

                clearCart();
                navigate("/orders", {
                  state: { message: "Order placed successfully!" },
                });
              } catch (err) {
                setError("Payment verification failed");
              }
            },

            prefill: {
              name: user?.name,
              email: user?.email,
            },
          };

          new window.Razorpay(options).open();
        };

        document.body.appendChild(script);
      } else {
        clearCart();
        navigate("/orders", { state: { message: "Order placed successfully!" } });
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto mt-16 p-6 bg-blue-100 border border-blue-500 text-blue-700 rounded-lg">
        Please login to proceed with checkout.
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto mt-16 p-6 bg-yellow-100 border border-yellow-500 text-yellow-700 rounded-lg">
        Your cart is empty. Add items before checkout.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-10 text-center">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-gray-300 rounded-xl shadow-md p-6">
            <h2 className="font-bold text-2xl mb-6 border-b pb-3">Shipping Address</h2>

            <div className="mb-4">
              <label className="block font-semibold mb-2">Street Address *</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                required
                placeholder="123 Main Street"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-semibold mb-2">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="New York"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  placeholder="NY"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block font-semibold mb-2">ZIP Code *</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                  placeholder="10001"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-300 rounded-xl shadow-md p-6">
            <h2 className="font-bold text-2xl mb-6 border-b pb-3">Payment Method</h2>

            <div className="space-y-4">
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="razorpay"
                  checked={formData.paymentMethod === "razorpay"}
                  onChange={handleChange}
                  className="mr-3"
                />
                <span className="font-semibold">Razorpay (Card, UPI, NetBanking)</span>
              </label>

              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === "cod"}
                  onChange={handleChange}
                  className="mr-3"
                />
                <span className="font-semibold">Cash on Delivery</span>
              </label>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold text-white transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </div>

        <div>
          <div className="bg-white border border-gray-300 rounded-xl shadow-md p-6 sticky top-20">
            <h2 className="font-bold text-2xl mb-6 border-b pb-3">Order Summary</h2>

            <div className="mb-6 max-h-96 overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between mb-4 text-sm border border-gray-300 rounded-lg p-3"
                >
                  <img
                    src={
                      categoryImages[item.category?.toLowerCase()] ||
                      item.imageUrl ||
                      "https://via.placeholder.com/100"
                    }
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded mr-3"
                  />

                  <span className="flex-1">
                    {item.name} × {item.quantity}
                  </span>

                  <span className="font-bold">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-6 space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{totalPrice}</span>
              </div>

              <div className="flex justify-between text-green-600">
                <span>Shipping</span>
                <span>FREE</span>
              </div>

              <div className="flex justify-between font-bold text-xl border-t pt-3">
                <span>Total</span>
                <span className="text-green-600">₹{totalPrice}</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
