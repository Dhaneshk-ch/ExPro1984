// Admin Dashboard
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";
import apiClient from "../../utils/apiClient";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes, usersRes] = await Promise.all([
          apiClient.get("/products?limit=1000"),
          apiClient.get("/orders"),
          apiClient.get("/auth/users"),
        ]);

        const orders = ordersRes.data.orders || [];
        const totalRevenue = orders.reduce((sum, order) => {
          return order.paymentStatus === "completed"
            ? sum + order.totalAmount
            : sum;
        }, 0);

        setStats({
          totalProducts:
            productsRes.data.count ||
            productsRes.data.products?.length ||
            0,
          totalOrders: ordersRes.data.count || orders.length || 0,
          totalCustomers:
            usersRes.data.count ||
            usersRes.data.users?.length ||
            0,
          totalRevenue,
        });

        setRecentOrders(orders.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminNavbar>
      {/* Page Header */}
      <div className="admin-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
            Welcome back! Here's your store performance.
          </p>
        </div>
        <div className="admin-header-actions">
          <Link to="/admin/add-product" className="btn btn-success" style={{fontSize:'14px',padding:'10px 16px'}}>
            ➕ Add New Product
          </Link>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', paddingTop: '48px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#6b7280' }}>Loading dashboard...</p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">📦 Total Products</div>
              <div className="stat-value">{stats.totalProducts}</div>
              <div className="stat-detail">Active in inventory</div>
            </div>

            <div className="stat-card success">
              <div className="stat-label">📋 Total Orders</div>
              <div className="stat-value">{stats.totalOrders}</div>
              <div className="stat-detail">All time orders</div>
            </div>

            <div className="stat-card warning">
              <div className="stat-label">👥 Total Customers</div>
              <div className="stat-value">{stats.totalCustomers}</div>
              <div className="stat-detail">Registered users</div>
            </div>

            <div className="stat-card danger">
              <div className="stat-label">💰 Total Revenue</div>
              <div className="stat-value">₹{(stats.totalRevenue / 100000).toFixed(1)}L</div>
              <div className="stat-detail">From completed orders</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{
            background: '#fff',
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '28px',
            boxShadow: '0 2px 8px rgba(17,24,39,0.06)'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700' }}>
              Quick Actions
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px'
            }}>
              <Link to="/admin/add-product" className="btn btn-success" style={{textAlign:'center'}}>
                ➕ Add Product
              </Link>
              <Link to="/admin/products" className="btn btn-primary" style={{textAlign:'center'}}>
                📦 View Products
              </Link>
              <Link to="/admin/orders" className="btn btn-primary" style={{textAlign:'center'}}>
                📋 View Orders
              </Link>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="admin-table-card">
            <div style={{padding:'20px',borderBottom:'1px solid #e5e7eb'}}>
              <h3 style={{margin:'0',fontSize:'16px',fontWeight:'700'}}>Recent Orders</h3>
            </div>

            {recentOrders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📭</div>
                <div className="empty-state-text">No orders yet</div>
                <p style={{fontSize:'12px',color:'#9ca3af'}}>Orders will appear here when customers place them</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order._id}>
                        <td>
                          <span style={{fontWeight:'600',color:'var(--primary)'}}>
                            #{order._id.slice(-8).toUpperCase()}
                          </span>
                        </td>
                        <td>{order.userId?.name || "Unknown User"}</td>
                        <td style={{fontWeight:'600'}}>₹{order.totalAmount.toLocaleString('en-IN')}</td>
                        <td>
                          <span style={{
                            display:'inline-block',
                            padding:'4px 12px',
                            borderRadius:'6px',
                            fontSize:'12px',
                            fontWeight:'600',
                            background: order.orderStatus === 'completed' ? '#d1fae5' : '#fef3c7',
                            color: order.orderStatus === 'completed' ? '#065f46' : '#92400e'
                          }}>
                            {order.orderStatus}
                          </span>
                        </td>
                        <td style={{color:'#6b7280',fontSize:'13px'}}>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </AdminNavbar>
  );
};

export default AdminDashboard;
