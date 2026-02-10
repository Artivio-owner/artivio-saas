import { api } from './api';

export const AdminService = {
  companies() {
    return api.get('/admin/companies');
  },
  users() {
    return api.get('/admin/users');
  },
  landings() {
    return api.get('/admin/landings');
  },
};