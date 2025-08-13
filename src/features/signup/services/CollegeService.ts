import api from '../../../services/api';

// Service logic for signup goes here

const signupService = () => {
  // Implement your signup logic here
};

export default signupService;

export interface College {
  id: number;
  name: string;
  logoUrl?: string;
  domain: string;
}

export const fetchColleges = async (): Promise<College[]> => {
  const response = await api.get('/auth/colleges');
  return response.data;
};
