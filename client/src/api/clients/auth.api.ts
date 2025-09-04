import { axiosInstance } from '@client/lib/axios';
export type LoginRequest = { email: string; password: string };
// Server returns { data: { token, user } } for /auth/login
export type LoginResponse = {
  data: { token: string; user: { id: string; role: 'user' | 'admin' } };
};
/**
 * Authenticates a user with the provided email and password.
 * @param data - The login credentials.
 * @returns The login response body containing { data: { token, user } }.
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const res = await axiosInstance.post<LoginResponse>('/auth/login', data);
  return res.data;
}

export type RegisterRequest = { email: string; password: string };
// Server returns { data: { id, email } } for /auth/register
export type RegisterResponse = { data: { id: string; email: string } };
/**
 * Registers a new user with the provided email and password.
 * @param data - The registration data containing email and password.
 * @returns The registered user's id and email, wrapped in { data }.
 */
export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  const res = await axiosInstance.post<RegisterResponse>('/auth/register', data);
  return res.data;
}
