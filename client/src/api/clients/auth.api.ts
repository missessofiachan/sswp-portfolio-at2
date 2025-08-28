import { axiosInstance } from '@client/lib/axios';
export type LoginRequest = { email: string; password: string };
export type LoginResponse = { token: string; user: { id: string; role: 'user' | 'admin' } };
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const res = await axiosInstance.post<LoginResponse>('/auth/login', data);
  return res.data;
}

export type RegisterRequest = { email: string; password: string };
export type RegisterResponse = { data: { id: string; email: string } };
export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  const res = await axiosInstance.post<RegisterResponse>('/auth/register', data);
  return res.data;
}
