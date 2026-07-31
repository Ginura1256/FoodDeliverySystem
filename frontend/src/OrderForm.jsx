import { useState, useEffect } from 'react';
import axios from 'axios';

// Primary & Fallback API URLs
const MENU_API_URL = 'http://localhost:5158/api/menuitems';
const ORDER_API_URL = 'http://localhost:5158/api/orders';
const FALLBACK_ORDER_API_URL = 'http://localhost:5000/api/orders';

export default function OrderForm({ onOrderCreated }) {
  const [customerId] = useState(1); // Hardcoded to 1 as per assignment spec
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch available menu items from backend
  useEffect(() => {
    const getMenuItems = async () => {
      try {
        setLoadingMenu(true);
        const res = await axios.get(MENU_API_URL);
        setMenuItems(res.data || []);
      } catch (err) {
        console.error('Failed to load menu items:', err);
      } finally {
        setLoadingMenu(false);
      }
    };
    getMenuItems();
  }, []);

  // Toggle item selection
  const handleToggleItem = (item) => {
    if (selectedItems.some((i) => i.id === item.id)) {
      setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  // Total calculation
  const calculatedTotal = selectedItems.reduce((sum, item) => sum + Number(item.price), 0);

  // Submit Order to backend API
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (selectedItems.length === 0 && calculatedTotal === 0) {
      setErrorMessage('Please select at least one menu item to place an order.');
      return;
    }

    const payload = {
      customerId: Number(customerId),
      totalAmount: Number(calculatedTotal.toFixed(2)),
      status: 'Pending',
    };

    try {
      setSubmitting(true);
      try {
        await axios.post(ORDER_API_URL, payload);
      } catch {
        await axios.post(FALLBACK_ORDER_API_URL, payload);
      }

      setSuccessMessage(`✅ Order successfully created for Customer #${customerId}! Total: $${calculatedTotal.toFixed(2)}`);
      setSelectedItems([]);

      if (onOrderCreated) {
        onOrderCreated();
      }
    } catch (err) {
      console.error('Order Submission Error:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to submit order. Please verify API backend is running.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.05)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '1.4rem' }}>📝</span>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>Create New Food Order</h2>
          <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Select items below to place order</p>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div
          style={{
            padding: '0.85rem 1rem',
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '10px',
            color: '#047857',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1rem',
          }}
        >
          {successMessage}
        </div>
      )}

      {/* Error Notification */}
      {errorMessage && (
        <div
          style={{
            padding: '0.85rem 1rem',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '10px',
            color: '#b91c1c',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1rem',
          }}
        >
          ⚠️ {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmitOrder}>
        {/* Customer ID input (Hardcoded to 1) */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569', marginBottom: '0.35rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Customer ID (Fixed Spec)
          </label>
          <input
            type="number"
            value={customerId}
            readOnly
            style={{
              width: '100%',
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              padding: '0.65rem 0.85rem',
              color: '#334155',
              fontWeight: 700,
              fontSize: '0.95rem',
            }}
          />
        </div>

        {/* Menu Item Selection List */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569', marginBottom: '0.5rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Select Menu Items:
          </label>

          {loadingMenu ? (
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Loading available items...</p>
          ) : menuItems.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>No menu items found in backend.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '220px', overflowY: 'auto' }}>
              {menuItems.map((item) => {
                const isSelected = selectedItems.some((i) => i.id === item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleToggleItem(item)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem 0.9rem',
                      background: isSelected ? '#fff7ed' : '#f8fafc',
                      border: isSelected ? '2px solid #ff6b00' : '1px solid #e2e8f0',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 4px 12px rgba(255, 107, 0, 0.12)' : 'none',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: isSelected ? '#c2410c' : '#0f172a' }}>
                        {isSelected ? '✓ ' : ''}{item.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{item.description}</div>
                    </div>
                    <div style={{ fontWeight: 800, color: '#059669', fontSize: '0.95rem' }}>
                      ${Number(item.price).toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Calculated Total Amount */}
        <div
          style={{
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            padding: '0.85rem 1rem',
            background: '#f8fafc',
            borderRadius: '12px',
            marginBottom: '1.25rem',
            border: '1px solid #e2e8f0',
          }}
        >
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>Order Total Amount:</span>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ff6b00' }}>
            ${calculatedTotal.toFixed(2)}
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary"
          style={{ width: '100%', padding: '0.85rem' }}
        >
          {submitting ? 'Placing Order...' : '🚀 Place Order (POST /api/orders)'}
        </button>
      </form>
    </div>
  );
}
