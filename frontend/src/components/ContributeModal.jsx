import React, { useState } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { savingsService } from '../services/savingsService';
import { formatINR } from '../utils/formatters';

const ContributeModal = ({ isOpen, onClose, onSuccess, goal }) => {
  const [formData, setFormData] = useState({
    amount: '',
    contributionDate: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!goal) return;
    setLoading(true);
    setError('');

    try {
      await savingsService.contribute(goal.id, {
        ...formData,
        amount: parseFloat(formData.amount)
      });
      onSuccess();
      onClose();
      setFormData({
        amount: '',
        contributionDate: new Date().toISOString().split('T')[0],
        notes: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to deposit savings contribution');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !goal) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Add Money to Goal</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Goal: <strong>{goal.title}</strong> (Remaining: {formatINR(goal.targetAmount - goal.currentAmount)})
            </p>
          </div>
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

            {/* Academic ACID Note */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.625rem 0.875rem',
              backgroundColor: '#f0fdf4',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #bbf7d0',
              color: '#166534',
              fontSize: '0.75rem',
              fontWeight: 500,
              marginBottom: '1.25rem'
            }}>
              <ShieldCheck size={16} />
              <span>ACID Guaranteed: Contribution and goal progression are saved in a single atomic transaction.</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Deposit Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  className="form-control currency-amount"
                  placeholder="5000.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Deposit Date</label>
                <input
                  type="date"
                  required
                  className="form-control"
                  value={formData.contributionDate}
                  onChange={(e) => setFormData({ ...formData, contributionDate: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Notes / Source (Optional)</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. November salary allocation, Project bonus"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Depositing...' : 'Confirm Deposit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContributeModal;
