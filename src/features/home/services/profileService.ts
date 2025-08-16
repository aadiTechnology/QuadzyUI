import api from '../../../services/api';

export const fetchUserProfile = async (handle: string) => {
  const res = await api.get(`/auth/users/${handle}/profile`);
  return res.data;
};