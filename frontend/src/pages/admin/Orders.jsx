// Admin Orders Page
import React, { useState, useEffect } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import apiClient from "../../utils/apiClient";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = selectedStatus ? `?status=${selectedStatus}` : "";
      const response = await apiClient.get(`/orders${params}`);
      setOrders(response.data.orders || []);
    } catch (err) {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await apiClient.put(`/orders/${orderId}/status`, {
        orderStatus: newStatus,
      });
      fetchOrders();
      alert("Order status updated");
    } catch (err) {
      alert("Failed to update order");
    }
  };

  const statusOptions = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

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

  return (
    <AdminNavbar>
      <div className="admin-header">
        <div>
          <h1>Orders</h1>
          <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
            Manage customer orders and update statuses.
          </p>
        </div>
      </div>

      {/* Status Filter */}
      <div className="mb-6">
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Orders</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <div className="admin-table-card">
          <div style={{ padding: '0' }}>
            <table className="admin-table w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left font-bold">Order ID</th>
                  <th className="py-3 px-4 text-left font-bold">Customer</th>
                  <th className="py-3 px-4 text-left font-bold">Amount</th>
                  <th className="py-3 px-4 text-left font-bold">Items</th>
                  <th className="py-3 px-4 text-left font-bold">Status</th>
                  <th className="py-3 px-4 text-left font-bold">Payment</th>
                  <th className="py-3 px-4 text-left font-bold">Date</th>
                  <th className="py-3 px-4 text-left font-bold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-bold">{order._id.slice(-8).toUpperCase()}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-bold">{order.userId?.name || "Unknown"}</p>
                        <p className="text-sm text-gray-600">{order.userId?.email || "N/A"}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold">₹{order.totalAmount}</td>
                    <td className="py-3 px-4">{order.items?.length} items</td>
                    <td className="py-3 px-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className={`px-2 py-1 rounded text-xs font-bold cursor-pointer border-0 ${getStatusColor(
                          order.orderStatus
                        )}`}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          order.paymentStatus === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:text-blue-800 font-bold">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminNavbar>
  );
};

export default AdminOrders;
