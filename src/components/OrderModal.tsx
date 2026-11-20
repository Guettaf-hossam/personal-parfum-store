import { Minus, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { STORE_CONFIG } from '../data/store';
import { WILAYAS } from '../data/wilayas';
import { Product } from '../types';
import { buildWhatsAppUrl, formatPrice } from '../utils/formatting';

interface OrderModalProps {
  product: Product | null;
  onClose: () => void;
}

export function OrderModal({ product, onClose }: OrderModalProps) {
  const { language, t } = useLanguage();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedWilaya, setSelectedWilaya] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [product]);

  if (!product) return null;

  const totalPrice = product.price * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const wilayaObj = WILAYAS.find((w) => w.code === selectedWilaya);
    const wilayaName = wilayaObj
      ? language === 'ar'
        ? wilayaObj.nameAr
        : wilayaObj.nameFr
      : selectedWilaya;

    let message = '';
    if (language === 'ar') {
      message = [
        `السلام عليكم، أود طلب العطر التالي من ${STORE_CONFIG.storeNameAr} :`,
        `• العطر: *${product.name}*`,
        `• الحجم: *${product.volume}*`,
        `• السعر الفردي: *${formatPrice(product.price, 'ar')}*`,
        `• الكمية: *${quantity}*`,
        `• المجموع الإجمالي: *${formatPrice(totalPrice, 'ar')}*`,
        customerName ? `• الاسم: *${customerName}*` : '',
        customerPhone ? `• رقم الهاتف: *${customerPhone}*` : '',
        wilayaName ? `• الولاية: *${wilayaName}*` : '',
      ]
        .filter(Boolean)
        .join('\n');
    } else {
      message = [
        `Bonjour, je souhaite commander ce parfum chez ${STORE_CONFIG.storeNameFr} :`,
        `• Parfum : *${product.name}*`,
        `• Volume : *${product.volume}*`,
        `• Prix unitaire : *${formatPrice(product.price, 'fr')}*`,
        `• Quantité : *${quantity}*`,
        `• Total : *${formatPrice(totalPrice, 'fr')}*`,
        customerName ? `• Nom : *${customerName}*` : '',
        customerPhone ? `• Téléphone : *${customerPhone}*` : '',
        wilayaName ? `• Wilaya : *${wilayaName}*` : '',
      ]
        .filter(Boolean)
        .join('\n');
    }

    const url = buildWhatsAppUrl(STORE_CONFIG.whatsappNumber, message);
    window.open(url, '_blank');
    onClose();
  };

  return (
    <div
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-md p-0 sm:items-center sm:p-4 animate-in fade-in duration-200"
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl border border-stone-200 bg-white/95 text-[#181512] shadow-2xl backdrop-blur-xl sm:rounded-3xl dark:border-[#ffb442]/25 dark:bg-[#0e1015]/95 dark:text-white"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-200 bg-white/95 px-5 py-3.5 backdrop-blur-md dark:border-white/10 dark:bg-[#0e1015]/95">
          <h2 className="text-base font-bold text-[#181512] dark:text-white">
            {t('orderModalTitle')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('close')}
            className="flex size-8 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition-colors dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="flex items-center gap-3.5 rounded-2xl border border-stone-200 bg-stone-50 p-3 dark:border-[#ffb442]/20 dark:bg-[#090a0d]">
            <img
              src={product.image}
              alt={product.name}
              className="h-[85px] w-16 shrink-0 rounded-xl object-cover object-center ring-1 ring-stone-200 dark:ring-[#ffb442]/30 bg-stone-100 dark:bg-black/40 aspect-[3/4]"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-[#b87a14] dark:text-[#ffb442]">
                <span dir="ltr">{product.volume}</span> · {product.category}
              </span>
              <h3 className="truncate text-sm font-bold text-[#181512] dark:text-white">
                {product.name}
              </h3>
              <p className="text-sm font-extrabold text-[#b87a14] dark:text-[#ffb442]">
                {formatPrice(product.price, language)}
              </p>
            </div>
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-stone-700 dark:text-white/80">
              {t('customerName')}
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="محمد أمين / Amine"
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-[#181512] placeholder-stone-400 focus:border-[#b87a14] focus:outline-none dark:border-white/10 dark:bg-[#090a0d] dark:text-white dark:placeholder-white/30 dark:focus:border-[#ffb442]"
            />
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-stone-700 dark:text-white/80">
              {t('customerPhone')}
            </label>
            <input
              type="tel"
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="05 / 06 / 07 ..."
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-[#181512] placeholder-stone-400 focus:border-[#b87a14] focus:outline-none dark:border-white/10 dark:bg-[#090a0d] dark:text-white dark:placeholder-white/30 dark:focus:border-[#ffb442]"
            />
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-stone-700 dark:text-white/80">
              {t('wilaya')}
            </label>
            <select
              required
              value={selectedWilaya}
              onChange={(e) => setSelectedWilaya(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-[#181512] focus:border-[#b87a14] focus:outline-none dark:border-white/10 dark:bg-[#090a0d] dark:text-white dark:focus:border-[#ffb442]"
            >
              <option value="" disabled className="text-stone-400 dark:text-white/40">
                {t('selectWilaya')}
              </option>
              {WILAYAS.map((w) => (
                <option key={w.code} value={w.code} className="bg-white text-stone-900 dark:bg-[#14171c] dark:text-white">
                  {language === 'ar' ? w.nameAr : w.nameFr}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 p-3 dark:border-white/10 dark:bg-[#090a0d]">
            <span className="text-xs font-semibold text-stone-700 dark:text-white/80">
              {t('quantity')}
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="flex size-7 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 disabled:opacity-30 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/15"
              >
                <Minus size={13} />
              </button>
              <span className="w-6 text-center font-bold text-sm text-[#181512] dark:text-white">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="flex size-7 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/15"
              >
                <Plus size={13} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-stone-200 dark:border-white/10">
            <span className="text-xs font-bold text-stone-600 dark:text-white/70">
              {t('totalPrice')}
            </span>
            <span className="text-lg font-extrabold text-[#b87a14] dark:text-[#ffb442]">
              {formatPrice(totalPrice, language)}
            </span>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-[#ffb442] to-[#ffd07f] py-3 text-sm font-bold text-[#241500] shadow-md shadow-[#ffb442]/20 hover:brightness-105 active:scale-95 transition-all"
          >
            {t('confirmWhatsApp')}
          </button>
        </form>
      </div>
    </div>
  );
}