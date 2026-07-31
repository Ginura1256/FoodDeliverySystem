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
      setMenuItems(response.data || []);
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
      <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
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
          className="btn-secondary"
          style={{ marginTop: '1rem' }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>Restaurant Menu Items</h2>
          <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Catalog of available food items</p>
        </div>
        <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>{menuItems.length} items</span>
      </div>

      {menuItems.length === 0 ? (
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No menu items found.</p>
      ) : (
        <div style={{ overflowX: 'auto', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>ID</th>
                <th style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Name</th>
                <th style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Description</th>
                <th style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Price</th>
                <th style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: '700', color: '#0f172a' }}>#{item.id}</td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: '700', color: '#c2410c' }}>{item.name}</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#475569', fontSize: '0.85rem' }}>{item.description}</td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: '800', color: '#059669' }}>${Number(item.price).toFixed(2)}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span
                      style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        background: item.isAvailable !== false ? '#ecfdf5' : '#fef2f2',
                        color: item.isAvailable !== false ? '#047857' : '#b91c1c',
                        border: item.isAvailable !== false ? '1px solid #a7f3d0' : '1px solid #fecaca',
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
