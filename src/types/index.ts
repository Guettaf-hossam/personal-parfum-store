export interface Product {
  id: string;
  name: string;
  volume: string;
  category: string;
  price: number;
  old_price?: number | null;
  description?: string | null;
  image: string;
  is_featured: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export type Language = 'ar' | 'fr';

export type Theme = 'dark' | 'light';

export interface Wilaya {
  code: string;
  nameAr: string;
  nameFr: string;
}
