import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { transactionService } from '../services/transactionService';

const TransactionModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const [categories, setCategories] = useState([]);
  const [type, setType] = useState('EXPENSE');
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    categoryId: '',
    transactionDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'UPI',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadCategories();
      if (initialData) {
        setType(initialData.type);
        setFormData({
          title: initialData.title || '',
          amount: initialData.amount || '',
          categoryId: initialData.categoryId || '',
          transactionDate: initialData.transactionDate || new Date().toISOString().split('T')[0],
          paymentMethod: initialData.paymentMethod || 'UPI',
          description: initialData.description || ''
        });
      } else {
        setType('EXPENSE');
        setFormData({
          title: '',
          amount: '',
          categoryId: '',
          transactionDate: new Date().toISOString().split('T')[0],
          paymentMethod: 'UPI',
          description: ''
        });
      }
      setError('');
    }
  }, [isOpen, initialData]);

  const loadCategories = async () => {
    try {
      const data = await transactionService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const filteredCategories = categories.filter((c) => c.type === type);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.categoryId) {
      setError('Please select a category');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        type,
        amount: parseFloat(formData.amount)
      };

      if (initialData && initialData.id) {
        await transactionService.updateTransaction(initialData.id, payload);
      } else {
        await transactionService.createTransaction(payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save transaction');
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
            {initialData ? 'Edit Transaction' : 'New Transaction'}
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
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

            {/* Type Toggle: Expense or Income */}
            <div style={{
              display: 'flex',
              padding: '0.25rem',
              backgroundColor: '#f1f5f9',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem'
            }}>
              <button
                type="button"
                onClick={() => { setType('EXPENSE'); setFormData(prev => ({ ...prev, categoryId: '' })); }}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  backgroundColor: type === 'EXPENSE' ? 'var(--expense-red)' : 'transparent',
                  color: type === 'EXPENSE' ? '#ffffff' : 'var(--text-muted)',
                  transition: 'all 0.15s ease'
                }}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => { setType('INCOME'); setFormData(prev => ({ ...prev, categoryId: '' })); }}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  backgroundColor: type === 'INCOME' ? 'var(--income-green)' : 'transparent',
                  color: type === 'INCOME' ? '#ffffff' : 'var(--text-muted)',
                  transition: 'all 0.15s ease'
                }}
              >
                Income
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Title / Note</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Swiggy Lunch, Client Project, Metro Pass"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  className="form-control currency-amount"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  required
                  className="form-control"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {filteredCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  required
                  className="form-control"
                  value={formData.transactionDate}
                  onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <select
                  className="form-control"
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                >
                  <option value="UPI">UPI (Google Pay, PhonePe, Paytm)</option>
                  <option value="Net Banking">Net Banking / IMPS</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Description (Optional)</label>
              <textarea
                rows="2"
                className="form-control"
                placeholder="Additional notes or references..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Saving...' : initialData ? 'Update Transaction' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
