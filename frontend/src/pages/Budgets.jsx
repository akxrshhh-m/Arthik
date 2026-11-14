import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Edit2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { budgetService } from '../services/budgetService';
import Navbar from '../components/Navbar';
import BudgetModal from '../components/BudgetModal';
import { formatINR, getCategoryIcon } from '../utils/formatters';

const Budgets = () => {
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const data = await budgetService.getBudgets(selectedMonth);
      setBudgets(data);
      setError('');
    } catch (err) {
      console.error('Failed to load budgets:', err);
      setError('Failed to fetch budget details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [selectedMonth]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this category budget limit?')) {
      try {
        await budgetService.deleteBudget(id);
        fetchBudgets();
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to delete budget');
      }
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingBudget(null);
    setIsModalOpen(true);
  };

  // Calculate overall budget statistics
  const totalLimit = budgets.reduce((acc, b) => acc + (parseFloat(b.amountLimit) || 0), 0);
  const totalSpent = budgets.reduce((acc, b) => acc + (parseFloat(b.spentAmount) || 0), 0);
  const overallPercentage = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;

  return (
    <div className="main-content">
      <Navbar
        title="Budget Planner"
        subtitle="Control category spending caps and track real-time utilization"
        onAddTransaction={null}
      />

      <div className="page-wrapper">
        {/* Header Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Budget Period:
            </span>
            <input
              type="month"
              className="form-control"
              style={{ width: 'auto', padding: '0.45rem 0.75rem' }}
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          </div>

          <button onClick={handleAdd} className="btn btn-primary">
            <Plus size={16} />
            <span>Set New Category Budget</span>
          </button>
        </div>

        {error && (
          <div style={{
            padding: '1rem',
            backgroundColor: 'var(--expense-bg)',
            color: 'var(--expense-red)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem'
          }}>
            {error}
          </div>
        )}

        {/* Overall Budget Overview Card */}
        <div className="card budget-panel budget-overview">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                Total Monthly Budget Health
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Across {budgets.length} allocated expense categories
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="currency-amount" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                {formatINR(totalSpent)}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                {' '}/ {formatINR(totalLimit)}
              </span>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div style={{
            height: '10px',
            backgroundColor: 'rgba(255,255,255,0.13)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
            marginBottom: '0.5rem'
          }}>
            <div style={{
              height: '100%',
              width: `${Math.min(overallPercentage, 100)}%`,
              backgroundColor: overallPercentage > 100 ? 'var(--expense-red)' : overallPercentage >= 80 ? 'var(--warning-amber)' : 'var(--accent-primary)',
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.3s ease'
            }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>{overallPercentage.toFixed(1)}% utilized</span>
            <span>
              {totalLimit - totalSpent >= 0 ? `${formatINR(totalLimit - totalSpent)} left` : `${formatINR(totalSpent - totalLimit)} over limit`}
            </span>
          </div>
        </div>

        {/* Category Budget Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '1.25rem'
        }}>
          {budgets.length > 0 ? (
            budgets.map((b) => {
              const spent = parseFloat(b.spentAmount) || 0;
              const limit = parseFloat(b.amountLimit) || 0;
              const remaining = limit - spent;
              const pct = limit > 0 ? (spent / limit) * 100 : 0;
              const isOverBudget = pct > 100;
              const isWarning = pct >= 80 && !isOverBudget;

              return (
                <div
  key={b.id}
  className={`card budget-panel budget-category-card ${
    isOverBudget ? 'budget-over-limit' : isWarning ? 'budget-warning' : ''
  }`}
>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: `${b.categoryColor || '#10b981'}15`,
                        color: b.categoryColor || '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {getCategoryIcon(b.categoryIcon, 18)}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          {b.categoryName}
                        </h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {b.monthYear}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <button
                        onClick={() => handleEdit(b)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.35rem 0.5rem' }}
                        title="Edit limit"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '0.35rem 0.5rem' }}
                        title="Delete limit"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Warning / Alert Badge */}
                  {isOverBudget ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.4rem 0.65rem',
                      backgroundColor: 'var(--expense-bg)',
                      color: 'var(--expense-red)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      marginBottom: '0.875rem'
                    }}>
                      <AlertCircle size={14} />
                      <span>Budget Exceeded by {formatINR(spent - limit)}!</span>
                    </div>
                  ) : isWarning ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.4rem 0.65rem',
                      backgroundColor: 'var(--warning-bg)',
                      color: 'var(--warning-amber)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      marginBottom: '0.875rem'
                    }}>
                      <AlertTriangle size={14} />
                      <span>Warning: Spending exceeds 80% threshold!</span>
                    </div>
                  ) : null}

                  {/* Spending Progress Bar */}
                  <div style={{
                    height: '8px',
                    backgroundColor: 'rgba(255,255,255,0.13)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                    marginBottom: '0.625rem'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(pct, 100)}%`,
                      backgroundColor: isOverBudget ? 'var(--expense-red)' : isWarning ? 'var(--warning-amber)' : 'var(--accent-primary)',
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>

                  {/* Amounts breakdown */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '0.5rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Spent</span>
                      <strong className="currency-amount" style={{ fontSize: '0.925rem', color: isOverBudget ? 'var(--expense-red)' : 'var(--text-main)' }}>
                        {formatINR(spent)}
                      </strong>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Limit</span>
                      <span className="currency-amount" style={{ fontSize: '0.925rem', color: 'var(--text-main)', fontWeight: 600 }}>
                        {formatINR(limit)}
                      </span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Remaining</span>
                      <strong className="currency-amount" style={{ fontSize: '0.925rem', color: remaining >= 0 ? 'var(--income-green)' : 'var(--expense-red)' }}>
                        {formatINR(remaining >= 0 ? remaining : 0)}
                      </strong>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="budget-empty-state">
              <PieChart size={36} style={{ margin: '0 auto 0.75rem', color: '#cbd5e1' }} />
              <h4 style={{ fontWeight: 600, color: 'var(--text-main)' }}>No budgets set for {selectedMonth}</h4>
              <p style={{ fontSize: '0.8125rem', marginTop: '0.25rem', marginBottom: '1rem' }}>
                Set category limits to keep your monthly spending under control and receive 80% threshold warnings.
              </p>
              <button onClick={handleAdd} className="btn btn-primary btn-sm">
                <Plus size={14} />
                <span>Create Budget Limit</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <BudgetModal
        isOpen={isModalOpen}
        initialData={editingBudget}
        selectedMonth={selectedMonth}
        onClose={() => { setIsModalOpen(false); setEditingBudget(null); }}
        onSuccess={fetchBudgets}
      />
    </div>
  );
};

export default Budgets;
