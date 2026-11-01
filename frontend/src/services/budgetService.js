import api from './api';

export const budgetService = {
  async getBudgets(month) {
    const res = await api.get('/budgets', { params: month ? { month } : {} });
    return res.data;
  },

  async createBudget(data) {
    const res = await api.post('/budgets', data);
    return res.data;
  },

  async updateBudget(id, data) {
    const res = await api.put(`/budgets/${id}`, data);
    return res.data;
  },

  async deleteBudget(id) {
    const res = await api.delete(`/budgets/${id}`);
    return res.data;
  }
};
