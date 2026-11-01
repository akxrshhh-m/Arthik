import React, { useState, useEffect } from 'react';
import {
  Target,
  Plus,
  Coins,
  Calendar,
  CheckCircle2,
  Clock,
  History,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { savingsService } from '../services/savingsService';
import Navbar from '../components/Navbar';
import GoalModal from '../components/GoalModal';
import ContributeModal from '../components/ContributeModal';
import { formatINR, formatDate } from '../utils/formatters';

const SavingsGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  // Contributions history drawer / modal
  const [historyGoal, setHistoryGoal] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const data = await savingsService.getGoals();
      setGoals(data);
      setError('');
    } catch (err) {
      console.error('Error fetching savings goals:', err);
      setError('Failed to load savings goals.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleOpenContribute = (goal) => {
    setSelectedGoal(goal);
    setIsContributeModalOpen(true);
  };

  const handleViewHistory = async (goal) => {
    setHistoryGoal(goal);
    try {
      setLoadingHistory(true);
      const list = await savingsService.getContributions(goal.id);
      setContributions(list);
    } catch (err) {
      console.error('Error fetching contribution ledger:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  return (
    <div className="main-content">
      <Navbar
        title="Savings Goals & Reserves"
        subtitle="Track long-term financial milestones with ACID-guaranteed deposits"
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
          <div>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Total Goals Active: <strong>{goals.filter(g => g.status === 'IN_PROGRESS').length}</strong> | Completed: <strong>{goals.filter(g => g.status === 'COMPLETED').length}</strong>
            </span>
          </div>

          <button onClick={() => setIsGoalModalOpen(true)} className="btn btn-primary">
            <Plus size={16} />
            <span>Create New Goal</span>
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

        {/* Goals Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '1.5rem'
        }}>
          {goals.length > 0 ? (
            goals.map((goal) => {
              const current = parseFloat(goal.currentAmount) || 0;
              const target = parseFloat(goal.targetAmount) || 0;
              const remaining = target > current ? target - current : 0;
              const pct = target > 0 ? Math.min((current / target) * 100, 100) : 0;
              const isCompleted = goal.status === 'COMPLETED' || current >= target;

              return (
                <div key={goal.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    {/* Goal Header */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                      <div>
                        <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#64748b', marginBottom: '0.35rem' }}>
                          {goal.category || 'General'}
                        </span>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          {goal.title}
                        </h4>
                      </div>

                      {isCompleted ? (
                        <span className="badge badge-income">
                          <CheckCircle2 size={12} />
                          Completed
                        </span>
                      ) : (
                        <span className="badge" style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}>
                          <Clock size={12} />
                          In Progress
                        </span>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div style={{ margin: '1rem 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.4rem' }}>
                        <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{pct.toFixed(1)}% Saved</span>
                        <span style={{ color: 'var(--text-muted)' }}>Target: {formatDate(goal.targetDate)}</span>
                      </div>
                      <div style={{
                        height: '10px',
                        backgroundColor: '#f1f5f9',
                        borderRadius: 'var(--radius-full)',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${pct}%`,
                          backgroundColor: isCompleted ? 'var(--income-green)' : 'var(--accent-primary)',
                          borderRadius: 'var(--radius-full)',
                          transition: 'width 0.4s ease'
                        }} />
                      </div>
                    </div>

                    {/* Amounts Breakdown */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.75rem',
                      padding: '0.875rem',
                      backgroundColor: '#f8fafc',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: '1.25rem'
                    }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Saved So Far</span>
                        <strong className="currency-amount" style={{ fontSize: '1.05rem', color: 'var(--income-green)' }}>
                          {formatINR(current)}
                        </strong>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Remaining</span>
                        <strong className="currency-amount" style={{ fontSize: '1.05rem', color: isCompleted ? 'var(--income-green)' : 'var(--text-main)' }}>
                          {formatINR(remaining)}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                    {!isCompleted ? (
                      <button
                        onClick={() => handleOpenContribute(goal)}
                        className="btn btn-primary"
                        style={{ flex: 1, padding: '0.5rem' }}
                      >
                        <Coins size={15} />
                        <span>Add Money</span>
                      </button>
                    ) : (
                      <div style={{ flex: 1, textAlign: 'center', color: 'var(--income-green)', fontSize: '0.875rem', fontWeight: 600 }}>
                        Goal Accomplished! 🎉
                      </div>
                    )}

                    <button
                      onClick={() => handleViewHistory(goal)}
                      className="btn btn-secondary"
                      style={{ padding: '0.5rem 0.75rem' }}
                      title="View Deposit History"
                    >
                      <History size={15} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{
              gridColumn: '1 / -1',
              padding: '3.5rem',
              textAlign: 'center',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px dashed var(--border-subtle)',
              color: 'var(--text-muted)'
            }}>
              <Target size={36} style={{ margin: '0 auto 0.75rem', color: '#cbd5e1' }} />
              <h4 style={{ fontWeight: 600, color: 'var(--text-main)' }}>No savings goals created yet</h4>
              <p style={{ fontSize: '0.8125rem', marginTop: '0.25rem', marginBottom: '1rem' }}>
                Set a milestone for a laptop, trip, or emergency reserve and watch your progress build up.
              </p>
              <button onClick={() => setIsGoalModalOpen(true)} className="btn btn-primary btn-sm">
                <Plus size={14} />
                <span>Create First Goal</span>
              </button>
            </div>
          )}
        </div>

        {/* CONTRIBUTION HISTORY MODAL / DRAWER */}
        {historyGoal && (
          <div className="modal-overlay" onClick={() => setHistoryGoal(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Deposit History</h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    Goal: <strong>{historyGoal.title}</strong>
                  </p>
                </div>
                <button onClick={() => setHistoryGoal(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  ✕
                </button>
              </div>

              <div className="modal-body" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                {loadingHistory ? (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading history...</p>
                ) : contributions.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {contributions.map((c) => (
                      <div
                        key={c.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.75rem 1rem',
                          backgroundColor: '#f8fafc',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-subtle)'
                        }}
                      >
                        <div>
                          <strong className="currency-amount" style={{ color: 'var(--income-green)', fontSize: '0.95rem' }}>
                            + {formatINR(c.amount)}
                          </strong>
                          {c.notes && (
                            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {c.notes}
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {formatDate(c.contributionDate)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>
                    No contributions made to this goal yet.
                  </p>
                )}
              </div>

              <div className="modal-footer">
                <button onClick={() => setHistoryGoal(null)} className="btn btn-secondary">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSuccess={fetchGoals}
      />

      <ContributeModal
        isOpen={isContributeModalOpen}
        goal={selectedGoal}
        onClose={() => { setIsContributeModalOpen(false); setSelectedGoal(null); }}
        onSuccess={fetchGoals}
      />
    </div>
  );
};

export default SavingsGoals;
