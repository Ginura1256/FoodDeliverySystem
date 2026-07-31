import { useState, useEffect } from 'react';
import axios from 'axios';

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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Form State
  const [customerId, setCustomerId] = useState<number>(101);
  const [totalAmount, setTotalAmount] = useState<number>(24.99);
  const [status, setStatus] = useState<string>('Pending');
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Fetch orders from API using Axios
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get<Order[]>(API_BASE_URL);
      setOrders(res.data);
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

  // Handle New Order Creation using Axios
  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const newOrder = {
        customerId: Number(customerId),
        totalAmount: Number(totalAmount),
        status,
      };

      await axios.post(API_BASE_URL, newOrder);

      await fetchOrders();
      setIsModalOpen(false);
      // Reset form
      setCustomerId(Math.floor(100 + Math.random() * 900));
      setTotalAmount(parseFloat((15 + Math.random() * 50).toFixed(2)));
    } catch (err: any) {
      alert(err.message || 'Failed to submit order');
    } finally {
      setSubmitting(false);
    }
  };

  // Stats calculations
  const totalOrdersCount = orders.length;
  const pendingCount = orders.filter((o) => o.status.toLowerCase() === 'pending').length;
  const deliveredCount = orders.filter((o) => o.status.toLowerCase() === 'delivered').length;
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);

  return (
    <div className="container">
      {/* Navigation & Header */}
      <header className="header">
        <div className="logo-group">
          <div className="logo-icon">🍔</div>
          <div>
            <h1 className="logo-title">FoodDelivery System</h1>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Order Management Dashboard</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="api-badge">
            <div className="status-dot"></div>
            <span>API Online (PostgreSQL)</span>
          </div>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <span>+</span> Create Order
          </button>
        </div>
      </header>

      {/* Metrics Row */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>📦</div>
          <div>
            <div className="stat-val">{totalOrdersCount}</div>
            <div className="stat-label">Total Orders</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>⏳</div>
          <div>
            <div className="stat-val">{pendingCount}</div>
            <div className="stat-label">Pending Orders</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>✅</div>
          <div>
            <div className="stat-val">{deliveredCount}</div>
            <div className="stat-label">Delivered Orders</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' }}>💰</div>
          <div>
            <div className="stat-val">${totalRevenue.toFixed(2)}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
        </div>
      </div>

      {/* Main Content & Orders Table */}
      <div className="section-header">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Recent Customer Orders</h2>
        <button className="btn-secondary" onClick={fetchOrders} style={{ fontSize: '0.85rem' }}>
          🔄 Refresh
        </button>
      </div>

      <div className="orders-card">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
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
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            No orders found. Click "+ Create Order" to place your first order!
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
                    <td style={{ fontWeight: 600, color: '#f8fafc' }}>#{o.id}</td>
                    <td>Customer #{o.customerId}</td>
                    <td style={{ fontWeight: 600, color: '#34d399' }}>
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
                    <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                      {new Date(o.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Order Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Place New Order</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateOrder}>
              <div className="form-group">
                <label className="form-label">Customer ID</label>
                <input
                  type="number"
                  className="form-input"
                  value={customerId}
                  onChange={(e) => setCustomerId(Number(e.target.value))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Total Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(Number(e.target.value))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Order Status</label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Create Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
