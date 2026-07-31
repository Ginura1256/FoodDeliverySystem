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
      // Attempt primary port 5158, fallback to 5000 if needed
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
        background: 'rgba(30, 41, 59, 0.7)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '1.5rem' }}>📝</span>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>Create New Food Order</h2>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div
          style={{
            padding: '0.85rem 1rem',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '10px',
            color: '#34d399',
            fontSize: '0.85rem',
            fontWeight: 500,
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
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '10px',
            color: '#f87171',
            fontSize: '0.85rem',
            fontWeight: 500,
            marginBottom: '1rem',
          }}
        >
          ⚠️ {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmitOrder}>
        {/* Customer ID input (Hardcoded to 1) */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.4rem', fontWeight: 600 }}>
            Customer ID (Fixed Spec)
          </label>
          <input
            type="number"
            value={customerId}
            readOnly
            style={{
              width: '100%',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '0.65rem 0.85rem',
              color: '#94a3b8',
              fontWeight: 700,
            }}
          />
        </div>

        {/* Menu Item Selection List */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>
            Select Menu Items:
          </label>

          {loadingMenu ? (
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Loading available items...</p>
          ) : menuItems.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>No menu items found in backend.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
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
                      padding: '0.65rem 0.85rem',
                      background: isSelected ? 'rgba(245, 158, 11, 0.15)' : 'rgba(15, 23, 42, 0.4)',
                      border: isSelected ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: isSelected ? '#fbbf24' : '#f8fafc' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.description}</div>
                    </div>
                    <div style={{ fontWeight: 700, color: '#34d399', fontSize: '0.9rem' }}>
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
            background: 'rgba(15, 23, 42, 0.8)',
            borderRadius: '10px',
            marginBottom: '1.25rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#cbd5e1' }}>Order Total Amount:</span>
          <span style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f59e0b' }}>
            ${calculatedTotal.toFixed(2)}
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          style={{
            width: '100%',
            padding: '0.8rem',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
            transition: 'all 0.2s ease',
          }}
        >
          {submitting ? 'Placing Order...' : '🚀 Place Order (POST /api/orders)'}
        </button>
      </form>
    </div>
  );
}
