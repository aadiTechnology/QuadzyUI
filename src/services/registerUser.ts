import { API_URL } from '../constants/config';
export interface RegisterUserParams {
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

export async function registerUser(params: RegisterUserParams): Promise<void> {
    const response = await fetch(`${API_URL}/api/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!response.ok) {
    // Try to get backend error message
    let msg = 'Registration failed';
    try {
      const data = await response.json();
      msg = data.detail || msg;
    } catch {}
    throw new Error(msg);
  }
}
