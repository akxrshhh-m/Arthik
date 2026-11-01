import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { budgetService } from '../services/budgetService';
import { transactionService } from '../services/transactionService';

const BudgetModal = ({ isOpen, onClose, onSuccess, initialData = null, selectedMonth }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    categoryId: '',
    monthYear: selectedMonth || new Date().toISOString().slice(0, 7),
    amountLimit: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadCategories();
      if (initialData) {
        setFormData({
          categoryId: initialData.categoryId || '',
          monthYear: initialData.monthYear || selectedMonth,
          amountLimit: initialData.amountLimit || ''
        });
      } else {
        setFormData({
          categoryId: '',
          monthYear: selectedMonth || new Date().toISOString().slice(0, 7),
          amountLimit: ''
        });
      }
      setError('');
    }
  }, [isOpen, initialData, selectedMonth]);

  const loadCategories = async () => {
    try {
      const data = await transactionService.getCategories();
      // Only expense categories get monthly budgets
      setCategories(data.filter((c) => c.type === 'EXPENSE'));
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.categoryId) {
      setError('Please select an expense category');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        amountLimit: parseFloat(formData.amountLimit)
      };

      if (initialData && initialData.id) {
        await budgetService.updateBudget(initialData.id, payload);
      } else {
        await budgetService.createBudget(payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to set budget');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
            {initialData ? 'Update Category Budget' : 'Set Category Budget'}
          </h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div style={{
                padding: '0.75rem',
                backgroundColor: 'var(--expense-bg)',
                color: 'var(--expense-red)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8125rem',
                marginBottom: '1rem'
              }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Expense Category</label>
              <select
                required
                className="form-control"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Month & Year</label>
                <input
                  type="month"
                  required
                  className="form-control"
                  value={formData.monthYear}
                  onChange={(e) => setFormData({ ...formData, monthYear: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Monthly Limit (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  className="form-control currency-amount"
                  placeholder="e.g. 5000.00"
                  value={formData.amountLimit}
                  onChange={(e) => setFormData({ ...formData, amountLimit: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Saving...' : 'Save Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetModal;
