import api from './api';
import { loginUser } from './loginUser';
import { registerUser } from './registerUser';


export interface LoginParams {
  email: string;
  password: string;
}

export const login = async ({ email, password }: LoginParams) => {
  const response = await api.post('/login', { email, password });

  return response.data;
};

export const logoutUser = async () => {
  try {
    await api.post('/logout');
  } catch (error) {
    if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
      throw (error as any).response.data;
    }
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/me');
    return response.data;
  } catch (error) {
    if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
      throw (error as any).response.data;
    }
    throw error;
  }
};

export interface RegisterUserParams {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export const register = async (params: RegisterUserParams) => {
  // ...API call
  return { data: params }; // Example response
};

export const useAuth = () => {
  // Implement your custom hook logic here
  // This is just a placeholder implementation
  return {
    isAuthenticated: false,
    user: null,
    login,
    logout: logoutUser,
    register,
    getCurrentUser,
  };
};

const authService = {
  login: loginUser,
  register: registerUser,
  // ...
};

export default authService;
