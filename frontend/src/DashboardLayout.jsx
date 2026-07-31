import React from 'react';

export default function DashboardLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', color: '#0f172a' }}>
      {/* Sidebar Navigation */}
      <aside
        style={{
          width: '260px',
          background: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          padding: '1.5rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '4px 0 20px rgba(0, 0, 0, 0.02)',
        }}
      >
        <div>
          {/* Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '2.25rem', padding: '0 0.5rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #ff6b00, #ff8e53)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                boxShadow: '0 6px 16px rgba(255, 107, 0, 0.35)',
              }}
            >
              🍔
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>FoodDelivery</h2>
              <span style={{ fontSize: '0.75rem', color: '#ff6b00', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Admin Portal
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <a
              href="#dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                background: '#fff7ed',
                color: '#ff6b00',
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: '0.9rem',
                borderLeft: '4px solid #ff6b00',
              }}
            >
              📊 Dashboard
            </a>
            <a
              href="#menu"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                color: '#64748b',
                fontWeight: 600,
                textDecoration: 'none',
                fontSize: '0.9rem',
                transition: 'all 0.2s ease',
              }}
            >
              🍕 Menu Catalog
            </a>
            <a
              href="#orders"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                color: '#64748b',
                fontWeight: 600,
                textDecoration: 'none',
                fontSize: '0.9rem',
              }}
            >
              📦 Orders List
            </a>
            <a
              href="#analytics"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                color: '#64748b',
                fontWeight: 600,
                textDecoration: 'none',
                fontSize: '0.9rem',
              }}
            >
              📈 Analytics
            </a>
          </nav>
        </div>

        {/* Footer Admin User */}
        <div
          style={{
            padding: '0.85rem 1rem',
            background: '#f8fafc',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '0.85rem',
              boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)',
            }}
          >
            AD
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>System Admin</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>admin@fooddelivery.com</div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Topbar Header */}
        <header
          style={{
            height: '74px',
            borderBottom: '1px solid #e2e8f0',
            background: '#ffffff',
            padding: '0 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>Admin Executive Dashboard</h1>
            <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
              Live Order Operations & Real-Time PostgreSQL Synchronization
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 0.85rem',
                borderRadius: '20px',
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                color: '#047857',
                fontSize: '0.8rem',
                fontWeight: 700,
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
              PostgreSQL Connected
            </div>
          </div>
        </header>

        {/* Content Children */}
        <main style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>{children}</main>
      </div>
    </div>
  );
}
