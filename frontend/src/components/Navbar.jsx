import React from 'react';
import { Plus, Calendar } from 'lucide-react';

const Navbar = ({ title, subtitle, onAddTransaction }) => {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <header className="app-navbar">
      <div className="app-navbar__heading">
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>

      <div className="app-navbar__actions">
        <div className="app-navbar__period">
          <Calendar size={15} />
          <span>Period: {currentDate}</span>
        </div>

        {onAddTransaction && (
          <button
            onClick={onAddTransaction}
            className="btn btn-primary app-navbar__add-button"
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