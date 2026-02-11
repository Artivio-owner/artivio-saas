import { api } from './api';

export const ProductsService = {
  list() {
    return api.get('/products');
  },

  create(data: any) {
    return api.post('/products', data);
  },
};