import React from 'react';

export default function DashboardLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a', color: '#f8fafc' }}>
      {/* Sidebar Navigation */}
      <aside
        style={{
          width: '260px',
          background: 'rgba(30, 41, 59, 0.8)',
          backdropFilter: 'blur(12px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '1.5rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
        }}
      >
        <div>
          {/* Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', padding: '0 0.5rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
              }}
            >
              🍔
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>FoodDelivery</h2>
              <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600 }}>Admin Portal</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <a
              href="#dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#fbbf24',
                fontWeight: 600,
                textDecoration: 'none',
                fontSize: '0.9rem',
              }}
            >
              📊 Dashboard
            </a>
            <a
              href="#menu"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                color: '#94a3b8',
                textDecoration: 'none',
                fontSize: '0.9rem',
              }}
            >
              🍕 Menu Catalog
            </a>
            <a
              href="#orders"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                color: '#94a3b8',
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
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                color: '#94a3b8',
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
            padding: '0.85rem',
            background: 'rgba(15, 23, 42, 0.6)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#6366f1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '0.85rem',
            }}
          >
            AD
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>System Admin</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>admin@fooddelivery.com</div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Topbar Header */}
        <header
          style={{
            height: '70px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(30, 41, 59, 0.4)',
            backdropFilter: 'blur(12px)',
            padding: '0 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Admin Executive Dashboard</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '20px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#34d399',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              ● PostgreSQL Connected
            </div>
          </div>
        </header>

        {/* Content Children */}
        <main style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>{children}</main>
      </div>
    </div>
  );
}
