// TS types, invariants
export type Product = {
  id: string;
  name: string;
  price: number;
  description?: string;
  category: string;
  rating: number;
  createdAt: number; // epoch ms
};
