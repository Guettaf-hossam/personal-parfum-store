import { STORE_CONFIG } from '../data/store';
import { Language } from '../types';

export function formatPrice(amount: number, language: Language = 'ar'): string {
  const formatted = new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0,
  }).format(amount);

  const currency = language === 'ar' ? STORE_CONFIG.currencyAr : STORE_CONFIG.currencyFr;
  return `${formatted} ${currency}`;
}

export function calculateDiscount(currentPrice: number, oldPrice?: number | null): number | null {
  if (!oldPrice || oldPrice <= currentPrice) return null;
  return Math.round(((oldPrice - currentPrice) / oldPrice) * 100);
}

export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
