// This file exports global TypeScript types and interfaces.

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: 'student' | 'teacher' | 'admin';
}

export interface RegisterUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: number;
  qualification: string;
  preschoolId: number;
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface MenuItem {
  title: string;
  path: string;
  roles: Array<string>;
}

export interface AuthContextType {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface ScreenAccessConfig {
  path: string;
  allowedRoles: string[];
}

export interface Comment {
  commentId: number;
  userHandle: string;
  content: string;
  createdAt: string;
  // add other fields if needed
}