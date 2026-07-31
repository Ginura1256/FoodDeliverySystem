import { useState, useEffect } from 'react';
import axios from 'axios';

// Backend ASP.NET Core API endpoint
const API_URL = 'http://localhost:5158/api/menuitems';

export default function MenuList() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(API_URL);
      setMenuItems(response.data);
    } catch (err) {
      console.error('Error fetching menu items:', err);
      setError(err.message || 'Failed to fetch menu items from backend API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
        <p>Loading menu items from database...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
        <p>⚠️ {error}</p>
        <button
          onClick={fetchMenuItems}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            background: '#334155',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#f8fafc' }}>Restaurant Menu Items</h2>
        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{menuItems.length} items available</span>
      </div>

      {menuItems.length === 0 ? (
        <p style={{ color: '#94a3b8' }}>No menu items found.</p>
      ) : (
        <div style={{ overflowX: 'auto', background: 'rgba(30, 41, 59, 0.7)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(15, 23, 42, 0.6)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <th style={{ padding: '0.75rem 1rem', color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase' }}>ID</th>
                <th style={{ padding: '0.75rem 1rem', color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase' }}>Name</th>
                <th style={{ padding: '0.75rem 1rem', color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase' }}>Description</th>
                <th style={{ padding: '0.75rem 1rem', color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase' }}>Price</th>
                <th style={{ padding: '0.75rem 1rem', color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: '600', color: '#f8fafc' }}>#{item.id}</td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: '600', color: '#f59e0b' }}>{item.name}</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#cbd5e1', fontSize: '0.9rem' }}>{item.description}</td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: '600', color: '#34d399' }}>${Number(item.price).toFixed(2)}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span
                      style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        background: item.isAvailable !== false ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: item.isAvailable !== false ? '#34d399' : '#f87171',
                        border: item.isAvailable !== false ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                      }}
                    >
                      {item.isAvailable !== false ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
