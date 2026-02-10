/**
 * ============================================
 * ARTIVIO — SUPER ADMIN SERVICE
 * ============================================
 */

import { api } from '../../services/api';

export const AdminService = {
  companies() {
    return api.get('/super-admin/companies').then(r => r.data);
  },

  createCompany(data: {
    name: string;
    plan: string;
    domain?: string;
  }) {
    return api.post('/super-admin/companies', data).then(r => r.data);
  },

  domains(companyId: string) {
    return api.get(`/super-admin/domains/${companyId}`).then(r => r.data);
  },

  plans() {
    return api.get('/super-admin/plans').then(r => r.data);
  },

  landings() {
    return api.get('/super-admin/landings').then(r => r.data);
  },

  updateLanding(key: string, content: any) {
    return api.put(`/super-admin/landings/${key}`, content).then(r => r.data);
  },
};