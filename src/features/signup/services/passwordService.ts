import api from '../../../services/api';

export const setPassword = async (userId: number, new_password: string) => {
  return api.post(`/auth/users/${userId}/set-password`, { new_password });
};