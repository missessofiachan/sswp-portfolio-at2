import {
  type AdminUser,
  deleteUser,
  demoteUser,
  listUsers,
  promoteUser,
} from '@client/api/clients/admin.api';
import { btnOutline, card } from '@client/app/ui.css';
import { useEffect, useState } from 'react';

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  async function refresh() {
    try {
      setError(null);
      setUsers(await listUsers());
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || 'Error');
    }
  }
  useEffect(() => {
    refresh();
  }, []);
  return (
    <div className={card}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0 }}>Users</h2>
        <button className={btnOutline} onClick={refresh}>
          Refresh
        </button>
      </div>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Email</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Role</th>
            <th style={{ textAlign: 'right', borderBottom: '1px solid #ddd', padding: 8 }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td style={{ padding: 8 }}>{u.email}</td>
              <td style={{ padding: 8 }}>{u.role}</td>
              <td style={{ padding: 8, textAlign: 'right' }}>
                <button
                  className={btnOutline}
                  onClick={async () => {
                    if (!confirm(`Delete user ${u.email}?`)) return;
                    await deleteUser(u.id);
                    await refresh();
                  }}
                >
                  Delete
                </button>
                {u.role === 'user' ? (
                  <button
                    className={btnOutline}
                    style={{ marginLeft: 8 }}
                    onClick={async () => {
                      await promoteUser(u.id);
                      await refresh();
                    }}
                  >
                    Promote to admin
                  </button>
                ) : (
                  <button
                    className={btnOutline}
                    style={{ marginLeft: 8 }}
                    onClick={async () => {
                      await demoteUser(u.id);
                      await refresh();
                    }}
                  >
                    Demote to user
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && !error && <p>No users yet.</p>}
    </div>
  );
}
