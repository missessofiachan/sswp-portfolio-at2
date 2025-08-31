import { axiosInstance } from '@client/lib/axios';
export type LoginRequest = { email: string; password: string };
export type LoginResponse = {
  data: { token: string; user: { id: string; role: 'user' | 'admin' } };
};
/**
 * Authenticates a user with the provided email and password.
 * @param data - The login credentials.
 * @returns A promise resolving to the login response containing the token and user info.
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const res = await axiosInstance.post<LoginResponse>('/auth/login', data);
  return res.data;
}

export type RegisterRequest = { email: string; password: string };
export type RegisterResponse = { data: { id: string; email: string } };
/**
 * Registers a new user with the provided email and password.
 * @param data - The registration data containing email and password.
 * @returns A promise resolving to the registered user's id and email.
 */
export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  const res = await axiosInstance.post<RegisterResponse>('/auth/register', data);
  return res.data;
}
