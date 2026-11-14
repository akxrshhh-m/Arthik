import React from 'react';
import { formatINR } from '../utils/formatters';

const StatCard = ({
  title,
  amount,
  icon: Icon,
  color = '#10b981',
  bgLight = '#ecfdf5',
  badgeText,
  badgeColor
}) => {
  return (
    <div className="card stat-card">
      <div className="stat-card__top">
        <span className="stat-card__label">{title}</span>

        <div
          className="stat-card__icon"
          style={{
            backgroundColor: bgLight,
            color: color
          }}
        >
          {Icon && <Icon size={19} />}
        </div>
      </div>

      <div className="stat-card__bottom">
        <h3 className="currency-amount stat-card__amount">
          {formatINR(amount)}
        </h3>

        {badgeText && (
          <span
            className="stat-card__badge"
            style={{
              backgroundColor: badgeColor
                ? `${badgeColor}15`
                : 'var(--income-bg)',
              color: badgeColor || 'var(--income-green)'
            }}
          >
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;