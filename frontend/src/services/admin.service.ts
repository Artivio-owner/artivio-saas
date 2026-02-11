import { api } from './api';

export const AdminService = {
  companies() {
    return api.get('/admin/companies');
  },

  createCompany(data: any) {
    return api.post('/admin/companies', data);
  },

   users() {
    return api.get('/admin/users');
  },

  landings() {
    return api.get('/admin/landings');
  },

  saveLanding(data: any) {
    return api.post('/admin/landings', data);
  },
};