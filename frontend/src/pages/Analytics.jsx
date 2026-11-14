import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Cpu,
  Flame,
  Calendar,
  Layers,
  ArrowUpRight
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
  Cell,
  Legend
} from 'recharts';
import { analyticsService } from '../services/analyticsService';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import { formatINR, getCategoryIcon } from '../utils/formatters';

const Analytics = () => {
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [categorySpending, setCategorySpending] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [metrics, setMetrics] = useState({
    highestIndividualExpense: 0,
    averageDailySpending: 0
  });

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [catData, monthlyData, topCatData, metricsData] = await Promise.all([
        analyticsService.getCategorySpending(selectedMonth),
        analyticsService.getMonthlySummary(),
        analyticsService.getTopCategories(5),
        analyticsService.getMetrics()
      ]);

      setCategorySpending(catData);
      setMonthlySummary(monthlyData);
      setTopCategories(topCatData);
      setMetrics(metricsData);
      setError('');
    } catch (err) {
      console.error('Failed to load analytics data:', err);
      setError('Failed to fetch analytics from MySQL database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [selectedMonth]);

  const pieColors = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444', '#14b8a6'];

  return (
    <div className="main-content">
      <Navbar
        title="Spending Analytics & Algorithms"
        subtitle="Data-driven insights powered by MySQL aggregation and Java Max Heap"
        onAddTransaction={null}
      />

      <div className="page-wrapper">
        {/* Month selector & Academic Max Heap Banner */}
        <div style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.875rem',
          marginBottom: '1.5rem',
          color: '#1e40af',
          fontSize: '0.8125rem'
        }}>
          <Cpu size={22} color="#2563eb" />
          <div>
            <strong>ADSA Integration — Java Max Heap:</strong> Top 5 category ranking is processed via an algorithmic Binary Max Heap (Build Heap O(K), Extract-Max O(log K), Total: O(K + 5 log K)).
          </div>
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

        {/* TOP METRIC CARDS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.75rem'
        }}>
          <StatCard
            title="Highest Individual Expense"
            amount={metrics.highestIndividualExpense}
            icon={Flame}
            color="#ef4444"
            bgLight="#fef2f2"
            badgeText="Single Max Debit"
            badgeColor="#ef4444"
          />
          <StatCard
            title="Average Daily Spending"
            amount={metrics.averageDailySpending}
            icon={Calendar}
            color="#f59e0b"
            bgLight="#fffbeb"
            badgeText="For Active Days"
            badgeColor="#f59e0b"
          />
        </div>

        {/* CHARTS GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
          gap: '1.5rem',
          marginBottom: '1.75rem'
        }}>
          {/* Monthly Inflow vs Outflow Chart */}
          <div className="card dashboard-panel">
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              Historical Monthly Income vs Expenses
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              12-Month Inflow and Outflow trends from MySQL database
            </p>

            <div style={{ height: '300px', width: '100%' }}>
              {monthlySummary.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlySummary} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#ffffff', border: 'none' }}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                  No historical records available
                </div>
              )}
            </div>
          </div>

          {/* Category-Wise Expense Distribution */}
          <div className="card dashboard-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>
                  Category Expense Distribution
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Period: {selectedMonth}
                </p>
              </div>
              <input
                type="month"
                className="form-control"
                style={{ width: 'auto', padding: '0.35rem 0.65rem' }}
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
            </div>

            <div style={{ height: '300px', width: '100%', display: 'flex', alignItems: 'center' }}>
              {categorySpending.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categorySpending}
                      dataKey="amount"
                      nameKey="categoryName"
                      cx="50%"
                      cy="50%"
                      outerRadius={95}
                      innerRadius={60}
                      paddingAngle={3}
                    >
                      {categorySpending.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => [formatINR(val)]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', color: 'var(--text-muted)' }}>
                  No category spending recorded for {selectedMonth}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ADSA MAX HEAP: TOP 5 SPENDING CATEGORIES */}
        <div className="card dashboard-panel">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Top 5 Spending Categories</span>
                <span className="badge" style={{ backgroundColor: '#ecfdf5', color: '#047857', fontSize: '0.7rem' }}>
                  Extracted via Max Heap
                </span>
              </h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Sorted with Java Binary Max Heap root extraction
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {topCategories.length > 0 ? (
              topCategories.map((item, index) => {
                const maxAmount = topCategories[0]?.totalAmount || 1;
                const percentageOfMax = (item.totalAmount / maxAmount) * 100;

                return (
                  <div key={item.categoryName || index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: index === 0 ? '#fef3c7' : '#f1f5f9',
                      color: index === 0 ? '#b45309' : '#64748b',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      #{index + 1}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                          {item.categoryName}
                        </span>
                        <strong className="currency-amount" style={{ fontSize: '0.95rem', color: 'var(--expense-red)' }}>
                          {formatINR(item.totalAmount)}
                        </strong>
                      </div>

                      <div style={{
                        height: '6px',
                        backgroundColor: '#e2e8f0',
                        borderRadius: 'var(--radius-full)',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${percentageOfMax}%`,
                          backgroundColor: item.color || '#3b82f6',
                          borderRadius: 'var(--radius-full)'
                        }} />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>
                No category expense data available to build the Max Heap.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
