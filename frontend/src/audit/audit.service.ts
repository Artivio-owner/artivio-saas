import { api } from '../services/api';

export const AuditService = {
  list() {
    return api.get('/audit').then(r => r.data);
  },
};