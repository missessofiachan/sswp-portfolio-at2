import { axiosInstance } from '@client/lib/axios';
export type LoginRequest = { email: string; password: string };
export type LoginResponse = { token: string; user: { id: string; role: 'user' | 'admin' } };
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const res = await axiosInstance.post<LoginResponse>('/auth/login', data);
  return res.data;
}
