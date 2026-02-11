import { api } from './api';

export const LandingsService = {
  getLanding(key: string, language: string) {
    return api.get('/public/landings', {
      params: {
        key,
        language,
      },
    });
  },
};