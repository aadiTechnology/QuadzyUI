import api from '../../../services/api';

export const createPoll = (data: any) => {
  return api.post('/auth/polls', data);
};