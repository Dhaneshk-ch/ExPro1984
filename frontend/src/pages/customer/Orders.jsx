// Orders Page
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiClient from "../../utils/apiClient";

const Orders = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchOrders = async () => {
      try {
        const response = await apiClient.get("/orders/my");
        setOrders(response.data.orders);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Not logged in
  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          Please login to view your orders
        </div>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading orders...</p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  // No orders
  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">My Orders</h1>

        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-xl text-gray-600">
            You haven't placed any orders yet
          </p>
        </div>
      </div>
    );
  }

  // Orders list
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-6 pb-6 border-b">
              <div>
                <p className="text-gray-600 text-sm">Order Number</p>
                <p className="font-bold text-lg">
                  {order._id.slice(-8).toUpperCase()}
                </p>
              </div>

              <div>
                <p className="text-gray-600 text-sm">Order Date</p>
                <p className="font-bold">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-gray-600 text-sm">Status</p>
                <span
                  className={`px-3 py-1 rounded text-sm font-bold ${getStatusColor(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus.charAt(0).toUpperCase() +
                    order.orderStatus.slice(1)}
                </span>
              </div>

              <div>
                <p className="text-gray-600 text-sm">Total</p>
                <p className="font-bold text-green-600 text-xl">
                  ₹{order.totalAmount}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="mb-6">
              <h3 className="font-bold mb-3">Items</h3>

              <div className="space-y-2">
                {(order.items || []).map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {item.productName} × {item.quantity}
                    </span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping + Payment */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t">
              <div>
                <p className="text-gray-600 text-sm">Shipping Address</p>
                <p className="font-bold">
                  {order.shippingAddress.street}
                  <br />
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state}{" "}
                  {order.shippingAddress.zipCode}
                  <br />
                  {order.shippingAddress.country}
                </p>
              </div>

              <div>
                <p className="text-gray-600 text-sm">Payment</p>
                <p className="font-bold mb-2">
                  {order.paymentMethod.toUpperCase()}
                </p>

                <span
                  className={`px-3 py-1 rounded text-xs font-bold ${
                    order.paymentStatus === "completed"
                      ? "bg-green-100 text-green-800"
                      : order.paymentStatus === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {order.paymentStatus.charAt(0).toUpperCase() +
                    order.paymentStatus.slice(1)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
