export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  roleId: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  token: string;
  user?: User;
  error?: string;
  message?: string;
}
