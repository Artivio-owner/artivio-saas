import { api } from './api';

export const LandingsService = {
  get(key: string, language: string) {
    return api.get('/admin/landings', {
      params: { key, language },
    });
  },
};