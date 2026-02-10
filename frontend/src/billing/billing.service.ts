import { api } from '../services/api';

export const BillingService = {
  subscription() {
    return api.get('/billing/subscription').then(r => r.data);
  },
  limits() {
    return api.get('/billing/limits').then(r => r.data);
  },
};