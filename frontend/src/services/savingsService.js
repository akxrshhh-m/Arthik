import api from './api';

export const savingsService = {
  async getGoals() {
    const res = await api.get('/goals');
    return res.data;
  },

  async createGoal(data) {
    const res = await api.post('/goals', data);
    return res.data;
  },

  async contribute(goalId, data) {
    const res = await api.post(`/goals/${goalId}/contribute`, data);
    return res.data;
  },

  async getContributions(goalId) {
    const res = await api.get(`/goals/${goalId}/contributions`);
    return res.data;
  }
};
