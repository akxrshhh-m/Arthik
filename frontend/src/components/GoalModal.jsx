import React, { useState } from 'react';
import { X } from 'lucide-react';
import { savingsService } from '../services/savingsService';

const GoalModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    targetDate: '',
    category: 'General'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await savingsService.createGoal({
        ...formData,
        targetAmount: parseFloat(formData.targetAmount)
      });
      onSuccess();
      onClose();
      setFormData({
        title: '',
        targetAmount: '',
        targetDate: '',
        category: 'General'
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create savings goal');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>New Savings Goal</h3>
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
              <label className="form-label">Goal Title</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. MacBook Pro, Emergency Fund, Goa Trip"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Target Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  className="form-control currency-amount"
                  placeholder="50000.00"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Date</label>
                <input
                  type="date"
                  required
                  className="form-control"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Category / Purpose</label>
              <select
                className="form-control"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="General">General Savings</option>
                <option value="Emergency">Emergency Reserve</option>
                <option value="Tech & Work">Tech & Electronics</option>
                <option value="Travel">Travel & Vacation</option>
                <option value="Vehicle">Vehicle / Bike</option>
                <option value="Education">Education & Courses</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Creating...' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalModal;
