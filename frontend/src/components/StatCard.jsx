import React from 'react';
import { formatINR } from '../utils/formatters';

const StatCard = ({ title, amount, icon: Icon, color = '#10b981', bgLight = '#ecfdf5', badgeText, badgeColor }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </span>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          backgroundColor: bgLight,
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {Icon && <Icon size={18} />}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <h3 className="currency-amount" style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
          {formatINR(amount)}
        </h3>
        {badgeText && (
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '0.2rem 0.5rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: badgeColor ? `${badgeColor}15` : 'var(--income-bg)',
            color: badgeColor || 'var(--income-green)'
          }}>
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
