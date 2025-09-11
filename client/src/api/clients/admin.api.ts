import { axiosInstance } from '@client/lib/axios';

export type AdminUser = { id: string; email: string; role: 'user' | 'admin' };

export async function listUsers(): Promise<AdminUser[]> {
  const res = await axiosInstance.get('/admin/users');
  return res.data.data as AdminUser[];
}

export async function deleteUser(id: string): Promise<void> {
  await axiosInstance.delete(`/admin/users/${id}`);
}

export async function promoteUser(id: string): Promise<AdminUser> {
  const res = await axiosInstance.post(`/admin/users/${id}/promote`);
  return res.data.data as AdminUser;
}

export async function demoteUser(id: string): Promise<AdminUser> {
  const res = await axiosInstance.post(`/admin/users/${id}/demote`);
  return res.data.data as AdminUser;
}
