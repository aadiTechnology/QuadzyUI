import api from '../../../services/api';

export const requestOtp = async (collegeId: number, email: string) => {
  return api.post('/auth/signup/request-otp', { collegeId, email });
};

export const verifyOtp = async (email: string, otp: string) => {
  return api.post('/auth/signup/verify-otp', { email, otp });
};