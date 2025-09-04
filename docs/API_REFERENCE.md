# API Reference

Base URL: `http://localhost:4000/api/v1`

All responses are JSON.

Errors follow the shape: `{ "error": { "message": string } }` with relevant HTTP status codes (400/401/403/404/500).

## Health

GET `/health`

- 200 → `{ api: { ok: true, timestamp: string, uptimeSec: number }, database: { ok: boolean, store: 'firestore'|'memory', latencyMs: number|null } }`
- 503 → same shape as above with `database.ok: false` and `database.error: string`
- Notes: Checks API reachability and attempts a read-only database operation. Does not write data.

## Auth

POST `/auth/register`

- Body: `{ email: string, password: string }`
- 201 → `{ data: { id: string, email: string } }`

POST `/auth/login`

- Body: `{ email: string, password: string }`
- 200 → `{ data: { token: string, user: { id: string, role: 'user'|'admin' } } }`
- Notes: Include `Authorization: Bearer <token>` header for protected routes.

## Products

GET `/products`

- Query (optional): `sort[field]=price&sort[dir]=asc|desc`
- 200 → `{ data: Product[] }`

GET `/products/:id`

- 200 → `{ data: Product }`
- 404 → not found

POST `/products` (auth required)

- Body: `{ name: string, price: number, description?: string, category: string, rating?: number }`
- 201 → `{ data: Product }`

PUT `/products/:id` (auth required)

- Body: Partial of create payload
- 200 → `{ data: Product }`

DELETE `/products/:id` (admin required)

- 204 → no content

GET `/products/admin/stats` (admin required)

- 200 → `{ data: { count: number, avgPrice: number } }`

### Types

```
type Product = {
  id: string;
  name: string;
  price: number;
  description?: string;
  category: string;
  rating: number;
  createdAt: number; // epoch ms
}
```
