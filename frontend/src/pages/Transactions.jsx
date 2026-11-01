import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  Trash2,
  Edit2,
  ArrowUpRight,
  ArrowDownLeft,
  Cpu
} from 'lucide-react';
import { transactionService } from '../services/transactionService';
import Navbar from '../components/Navbar';
import TransactionModal from '../components/TransactionModal';
import { formatINR, formatDate, getCategoryIcon } from '../utils/formatters';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters & Sorting
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date' or 'amount'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedCategory) params.categoryId = selectedCategory;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (sortBy) params.sortBy = sortBy;
      if (sortOrder) params.order = sortOrder;

      const data = await transactionService.getTransactions(params);
      setTransactions(data);
      setError('');
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transaction history.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await transactionService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [selectedCategory, startDate, endDate, sortBy, sortOrder]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTransactions();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction record?')) {
      try {
        await transactionService.deleteTransaction(id);
        fetchTransactions();
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to delete transaction');
      }
    }
  };

  const handleEdit = (tx) => {
    setEditingTransaction(tx);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  return (
    <div className="main-content">
      <Navbar
        title="Transactions Ledger"
        subtitle="Manage debits, credits, and review algorithmically sorted records"
        onAddTransaction={handleAdd}
      />

      <div className="page-wrapper">
        {/* ADSA Academic Integration Banner */}
        <div style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: 'var(--radius-md)',
          padding: '0.875rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.5rem',
          color: '#166534',
          fontSize: '0.8125rem'
        }}>
          <Cpu size={20} color="#15803d" />
          <div>
            <strong>ADSA Integration — Java Merge Sort:</strong> Sorted dynamically in Java using custom divide-and-conquer Merge Sort (Time: O(N log N) worst & average case, Space: O(N), Stable).
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

        {/* CONTROLS BAR: SEARCH, FILTERS & MERGE SORT SELECTION */}
        <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            alignItems: 'end'
          }}>
            {/* Search form */}
            <form onSubmit={handleSearchSubmit} style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Search</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by title, description, or payment method..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ paddingLeft: '2.25rem' }}
                />
                <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              </div>
            </form>

            {/* Category Filter */}
            <div>
              <label className="form-label">Category</label>
              <select
                className="form-control"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="form-label">From Date</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            {/* End Date */}
            <div>
              <label className="form-label">To Date</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {/* Merge Sort Algorithm Controls */}
            <div>
              <label className="form-label">Merge Sort By</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select
                  className="form-control"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">Date</option>
                  <option value="amount">Amount</option>
                </select>
                <button
                  type="button"
                  onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                  className="btn btn-secondary"
                  title={`Order: ${sortOrder.toUpperCase()}`}
                  style={{ padding: '0.5rem 0.75rem' }}
                >
                  <ArrowUpDown size={16} />
                  <span style={{ fontSize: '0.75rem' }}>{sortOrder.toUpperCase()}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* TRANSACTIONS TABLE */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Type</th>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Title & Description</th>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Category</th>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Payment Method</th>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Date</th>
                  <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'right' }}>Amount</th>
                  <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((tx) => {
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
                        <td style={{ padding: '1rem' }}>
                          <span className={`badge ${isIncome ? 'badge-income' : 'badge-expense'}`}>
                            {isIncome ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                            {tx.type}
                          </span>
                        </td>

                        <td style={{ padding: '1rem' }}>
                          <strong style={{ color: 'var(--text-main)', display: 'block' }}>
                            {tx.title}
                          </strong>
                          {tx.description && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {tx.description}
                            </span>
                          )}
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
                              fontSize: '0.95rem',
                              color: isIncome ? 'var(--income-green)' : 'var(--expense-red)'
                            }}
                          >
                            {isIncome ? '+' : '-'} {formatINR(tx.amount)}
                          </span>
                        </td>

                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleEdit(tx)}
                              className="btn btn-secondary btn-sm"
                              title="Edit"
                              style={{ padding: '0.35rem 0.5rem' }}
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(tx.id)}
                              className="btn btn-danger btn-sm"
                              title="Delete"
                              style={{ padding: '0.35rem 0.5rem' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No transactions matching the selected filters.
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
        initialData={editingTransaction}
        onClose={() => { setIsModalOpen(false); setEditingTransaction(null); }}
        onSuccess={fetchTransactions}
      />
    </div>
  );
};

export default Transactions;
