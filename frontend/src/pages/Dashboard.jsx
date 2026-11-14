import React, { useState, useEffect } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import api from '../services/api';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import TransactionModal from '../components/TransactionModal';
import { formatINR, formatDate, getCategoryIcon } from '../utils/formatters';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard/summary');
      setSummary(res.data);
      setError('');
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError('Failed to fetch real-time financial data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const pieColors = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444', '#14b8a6'];

  return (
    <div className="main-content">
      <Navbar
        title="Financial Dashboard"
        subtitle="Real-time cash flow overview and spending breakdown"
        onAddTransaction={() => setIsModalOpen(true)}
      />

      <div className="page-wrapper">
        {error && (
          <div style={{
            padding: '1rem',
            backgroundColor: 'var(--expense-bg)',
            color: 'var(--expense-red)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            border: '1px solid #fecaca'
          }}>
            {error}
          </div>
        )}

        {/* 1. TOP STAT CARDS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.75rem'
        }}>
          <StatCard
            title="Total Net Balance"
            amount={summary?.totalBalance || 0}
            icon={Wallet}
            color="#10b981"
            bgLight="#ecfdf5"
            badgeText="All-time Net"
          />
          <StatCard
            title="Monthly Income"
            amount={summary?.monthlyIncome || 0}
            icon={TrendingUp}
            color="#10b981"
            bgLight="#ecfdf5"
            badgeText="+ Cash In"
          />
          <StatCard
            title="Monthly Expenses"
            amount={summary?.monthlyExpenses || 0}
            icon={TrendingDown}
            color="#ef4444"
            bgLight="#fef2f2"
            badgeText="- Cash Out"
            badgeColor="#ef4444"
          />
          <StatCard
            title="Monthly Savings"
            amount={summary?.monthlySavings || 0}
            icon={PiggyBank}
            color="#3b82f6"
            bgLight="#eff6ff"
            badgeText="Retained"
            badgeColor="#3b82f6"
          />
        </div>

        {/* 2. CHARTS SECTION */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
          gap: '1.5rem',
          marginBottom: '1.75rem'
        }}>
          {/* Monthly Inflow vs Outflow Chart */}
          <div className="card dashboard-panel">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Cash Flow Trend
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Monthly Income vs Expenses
                </p>
              </div>
            </div>

            <div style={{ height: '260px', width: '100%' }}>
              {summary?.monthlyComparison?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={summary.monthlyComparison} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                    />
                    <Tooltip
                      formatter={(val) => [formatINR(val)]}
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: '8px',
                        color: '#ffffff',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}
                      itemStyle={{ color: '#ffffff' }}
                    />
                    <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                  No historical comparison data yet
                </div>
              )}
            </div>
          </div>

          {/* Spending by Category Chart */}
          <div className="card dashboard-panel">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Category Breakdown
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Current month expenditure share
                </p>
              </div>
            </div>

            <div style={{ height: '260px', width: '100%', display: 'flex', alignItems: 'center' }}>
              {summary?.categorySpending?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={summary.categorySpending}
                      dataKey="amount"
                      nameKey="categoryName"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={50}
                      paddingAngle={3}
                    >
                      {summary.categorySpending.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val) => [formatINR(val)]}
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: '8px',
                        color: '#ffffff',
                        border: 'none'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', color: 'var(--text-muted)' }}>
                  No expense records found for this period
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. RECENT TRANSACTIONS TABLE */}
        <div className="card dashboard-panel">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Recent Transactions
              </h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Latest debits and credits recorded in MySQL
              </p>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Title</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Category</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Method</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Date</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {summary?.recentTransactions?.length > 0 ? (
                  summary.recentTransactions.map((tx) => {
                    const isIncome = tx.type === 'INCOME';
                    return (
                      <tr
                        key={tx.id}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          transition: 'background-color 0.1s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            backgroundColor: isIncome ? 'var(--income-bg)' : 'var(--expense-bg)',
                            color: isIncome ? 'var(--income-green)' : 'var(--expense-red)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            {isIncome ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                          </div>
                          <div>
                            <span style={{ fontWeight: 600, color: 'var(--text-main)', display: 'block' }}>
                              {tx.title}
                            </span>
                            {tx.description && (
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {tx.description}
                              </span>
                            )}
                          </div>
                        </td>

                        <td style={{ padding: '1rem' }}>
                          <span className="badge" style={{
                            backgroundColor: `${tx.categoryColor || '#10b981'}15`,
                            color: tx.categoryColor || '#10b981'
                          }}>
                            {getCategoryIcon(tx.categoryIcon, 14)}
                            {tx.categoryName}
                          </span>
                        </td>

                        <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                          {tx.paymentMethod}
                        </td>

                        <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                          {formatDate(tx.transactionDate)}
                        </td>

                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                          <span
                            className="currency-amount"
                            style={{
                              fontWeight: 700,
                              color: isIncome ? 'var(--income-green)' : 'var(--expense-red)'
                            }}
                          >
                            {isIncome ? '+' : '-'} {formatINR(tx.amount)}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No recent transactions recorded. Click "Add Transaction" to create your first entry.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchDashboardData}
      />
    </div>
  );
};

export default Dashboard;
