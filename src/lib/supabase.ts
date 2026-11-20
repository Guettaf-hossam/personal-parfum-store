import { createClient } from '@supabase/supabase-js';
import { SEED_PRODUCTS } from '../data/products';
import { Product } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

export async function getActiveProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured) {
    return SEED_PRODUCTS;
  }
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      return SEED_PRODUCTS;
    }
    return (data ?? []) as Product[];
  } catch {
    return SEED_PRODUCTS;
  }
}

export async function getAllProductsAdmin(): Promise<Product[]> {
  if (!isSupabaseConfigured) {
    return SEED_PRODUCTS;
  }
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }
  return (data ?? []) as Product[];
}

export async function upsertProduct(
  product: Partial<Product> & { name: string; price: number; image: string }
): Promise<Product | null> {
  if (!isSupabaseConfigured) {
    return null;
  }
  const { id, created_at: _createdAt, ...mutableFields } = product;

  if (id) {
    const updatePayload = {
      ...mutableFields,
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from('products')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Product;
  } else {
    const insertPayload = {
      ...mutableFields,
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from('products')
      .insert(insertPayload)
      .select()
      .single();
    if (error) throw error;
    return data as Product;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) return true;
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
  return true;
}

export async function toggleProductActive(id: string, currentStatus: boolean): Promise<boolean> {
  if (!isSupabaseConfigured) return !currentStatus;
  const { error } = await supabase
    .from('products')
    .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
  return !currentStatus;
}

export async function uploadProductImage(file: Blob, _fileName?: string): Promise<string> {
  if (!isSupabaseConfigured) {
    return URL.createObjectURL(file);
  }
  const path = `${Date.now()}-${crypto.randomUUID()}.webp`;
  const { error } = await supabase.storage.from('product-images').upload(path, file, {
    contentType: 'image/webp',
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from('product-images').getPublicUrl(path);
  return data.publicUrl;
}