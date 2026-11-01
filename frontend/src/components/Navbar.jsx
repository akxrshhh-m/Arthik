import React from 'react';
import { Plus, Calendar, Bell } from 'lucide-react';

const Navbar = ({ title, subtitle, onAddTransaction }) => {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <header style={{
      backgroundColor: 'var(--bg-card)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '1.25rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 20
    }}>
      <div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)' }}>
          {title}
        </h2>
        {subtitle && (
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.45rem 0.85rem',
          backgroundColor: '#f1f5f9',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.775rem',
          fontWeight: 600,
          color: 'var(--text-muted)'
        }}>
          <Calendar size={14} color="var(--accent-primary)" />
          <span>Period: {currentDate}</span>
        </div>

        {onAddTransaction && (
          <button
            onClick={onAddTransaction}
            className="btn btn-primary"
            style={{ boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)' }}
          >
            <Plus size={16} />
            <span>Add Transaction</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
