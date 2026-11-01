import api from './api';

export const analyticsService = {
  async getCategorySpending(month) {
    const res = await api.get('/analytics/category-spending', { params: month ? { month } : {} });
    return res.data;
  },

  async getMonthlySummary() {
    const res = await api.get('/analytics/monthly-summary');
    return res.data;
  },

  async getTopCategories(limit = 5) {
    const res = await api.get('/analytics/top-categories', { params: { limit } });
    return res.data;
  },

  async getMetrics() {
    const res = await api.get('/analytics/metrics');
    return res.data;
  }
};
