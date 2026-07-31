import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from './DashboardLayout';
import OrderForm from './OrderForm';
import MenuList from './MenuList';

interface Order {
  id: number;
  customerId: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = 'http://localhost:5158/api/orders';

export default function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders from backend API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get<Order[]>(API_BASE_URL);
      setOrders(res.data || []);
    } catch (err: any) {
      console.error(err);
      setError('Could not connect to API server at http://localhost:5158');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Calculate Dashboard Metrics
  const totalOrdersCount = orders.length;
  const pendingCount = orders.filter((o) => o.status.toLowerCase() === 'pending').length;
  const deliveredCount = orders.filter((o) => o.status.toLowerCase() === 'delivered').length;
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);

  return (
    <DashboardLayout>
      {/* Top Metrics Cards */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fff7ed', color: '#ff6b00' }}>📦</div>
          <div>
            <div className="stat-val">{totalOrdersCount}</div>
            <div className="stat-label">Total Orders</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#eef2ff', color: '#6366f1' }}>⏳</div>
          <div>
            <div className="stat-val">{pendingCount}</div>
            <div className="stat-label">Pending Orders</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>✅</div>
          <div>
            <div className="stat-val">{deliveredCount}</div>
            <div className="stat-label">Delivered Orders</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fdf2f8', color: '#ec4899' }}>💰</div>
          <div>
            <div className="stat-val">${totalRevenue.toFixed(2)}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Main Section: OrderForm & MenuList */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}
      >
        {/* Order Creation Form */}
        <OrderForm onOrderCreated={fetchOrders} />

        {/* Menu Catalog List Component */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.05)',
          }}
        >
          <MenuList />
        </div>
      </div>

      {/* Recent Orders List Table */}
      <div className="section-header">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Active Database Orders</h2>
          <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Real-time orders stored in PostgreSQL database</p>
        </div>
        <button className="btn-secondary" onClick={fetchOrders}>
          🔄 Refresh Orders
        </button>
      </div>

      <div className="orders-card">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            Loading orders from PostgreSQL...
          </div>
        ) : error ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#ef4444' }}>
            {error}
            <br />
            <button className="btn-secondary" onClick={fetchOrders} style={{ marginTop: '1rem' }}>
              Retry
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            No orders found in database. Use the Order Form above to place your first order!
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer ID</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>#{o.id}</td>
                    <td style={{ fontWeight: 600, color: '#334155' }}>Customer #{o.customerId}</td>
                    <td style={{ fontWeight: 800, color: '#059669' }}>
                      ${Number(o.totalAmount).toFixed(2)}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          o.status.toLowerCase() === 'delivered'
                            ? 'badge-delivered'
                            : o.status.toLowerCase() === 'preparing'
                            ? 'badge-preparing'
                            : 'badge-pending'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td style={{ color: '#64748b', fontSize: '0.85rem' }}>
                      {new Date(o.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
