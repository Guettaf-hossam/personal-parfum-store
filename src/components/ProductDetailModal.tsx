import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  MessageCircle,
  Share2,
  ShieldCheck,
  Star,
  Truck,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Product } from '../types';
import { calculateDiscount, formatPrice } from '../utils/formatting';

interface ProductDetailModalProps {
  product: Product | null;
  products: Product[];
  onClose: () => void;
  onOrder: (product: Product) => void;
  onShare: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export function ProductDetailModal({
  product,
  products,
  onClose,
  onOrder,
  onShare,
  onSelectProduct,
}: ProductDetailModalProps) {
  const { language, t } = useLanguage();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (product) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [product]);

  const currentIndex = product
    ? products.findIndex((p) => p.id === product.id)
    : -1;

  const handlePrev = useCallback(() => {
    if (products.length === 0 || currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + products.length) % products.length;
    onSelectProduct(products[prevIndex]);
    setIsZoomed(false);
  }, [products, currentIndex, onSelectProduct]);

  const handleNext = useCallback(() => {
    if (products.length === 0 || currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % products.length;
    onSelectProduct(products[nextIndex]);
    setIsZoomed(false);
  }, [products, currentIndex, onSelectProduct]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!product) return;
      if (e.key === 'Escape') {
        if (isLightboxOpen) {
          setIsLightboxOpen(false);
          setIsZoomed(false);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowLeft') {
        if (language === 'ar') handleNext();
        else handlePrev();
      } else if (e.key === 'ArrowRight') {
        if (language === 'ar') handlePrev();
        else handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, isLightboxOpen, language, handleNext, handlePrev, onClose]);

  if (!product) return null;

  const discount = calculateDiscount(product.price, product.old_price);

  return (
    <>
      <div
        role="presentation"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/85 backdrop-blur-md p-0 sm:items-center sm:p-4 animate-in fade-in duration-200"
      >
        <div
          role="dialog"
          aria-modal="true"
          className="relative flex w-full max-w-4xl max-h-[92vh] flex-col overflow-y-auto rounded-t-3xl border border-[#ffb442]/25 bg-[#0e1015]/95 text-white shadow-2xl backdrop-blur-xl md:flex-row md:overflow-hidden md:rounded-2xl dark:bg-[#0e1015]/95 not-dark:bg-white not-dark:text-slate-900 not-dark:border-slate-200"
        >
          <div className="relative aspect-[3/4] w-full shrink-0 overflow-hidden bg-[#090a0d] md:w-[52%] dark:bg-[#090a0d] not-dark:bg-slate-100">
            <img
              src={product.image}
              alt={product.name}
              onClick={() => setIsLightboxOpen(true)}
              className="size-full cursor-zoom-in object-cover object-center transition-transform duration-500 ease-out hover:scale-[1.03]"
            />

            {product.is_featured && (
              <span className="absolute start-3 top-3 flex items-center gap-1 rounded-full border border-[#ffb442]/40 bg-black/60 px-2.5 py-1 text-[11px] font-bold text-[#ffb442] backdrop-blur-md">
                <Star size={11} className="fill-[#ffb442] text-[#ffb442]" />
                <span>{t('featuredBadge')}</span>
              </span>
            )}

            {discount && (
              <span className="absolute end-3 top-3 rounded-full bg-rose-600/90 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm backdrop-blur-md">
                -{discount}%
              </span>
            )}

            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              className="absolute bottom-3 end-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/65 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-md transition-all hover:border-[#ffb442] hover:bg-[#ffb442] hover:text-[#241500]"
            >
              <Eye size={13} />
              <span>{t('tapToZoom')}</span>
            </button>

            <span className="absolute bottom-3 start-3 rounded-md border border-white/20 bg-black/65 px-2.5 py-1 font-mono text-[11px] font-semibold text-white/90 backdrop-blur-md">
              {product.volume}
            </span>
          </div>

          <div className="flex flex-1 flex-col justify-between p-5 sm:p-7">
            <div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-[#ffb442]/30 bg-[#ffb442]/10 px-3 py-1 text-xs font-bold text-[#ffb442]">
                    {product.category}
                  </span>
                  <span className="text-xs text-white/40 dark:text-white/40 not-dark:text-slate-400">
                    {currentIndex + 1} / {products.length}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label={t('prevProduct')}
                    className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 hover:border-[#ffb442]/50 hover:text-white transition-colors dark:border-white/10 dark:bg-white/5 not-dark:border-slate-200 not-dark:bg-slate-100 not-dark:text-slate-700"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label={t('nextProduct')}
                    className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 hover:border-[#ffb442]/50 hover:text-white transition-colors dark:border-white/10 dark:bg-white/5 not-dark:border-slate-200 not-dark:bg-slate-100 not-dark:text-slate-700"
                  >
                    <ChevronRight size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label={t('close')}
                    className="ms-1 flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 hover:bg-white/15 hover:text-white transition-colors dark:border-white/10 dark:bg-white/5 not-dark:border-slate-200 not-dark:bg-slate-100 not-dark:text-slate-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <h2 className="luxury-serif mt-3 text-xl font-bold leading-tight text-white dark:text-white not-dark:text-slate-900 sm:text-2xl">
                {product.name}
              </h2>

              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-2xl font-black text-[#ffb442] sm:text-3xl">
                  {formatPrice(product.price, language)}
                </span>
                {product.old_price && product.old_price > product.price && (
                  <span className="text-sm text-white/40 line-through dark:text-white/40 not-dark:text-slate-400">
                    {formatPrice(product.old_price, language)}
                  </span>
                )}
                {discount && (
                  <span className="rounded-md bg-rose-600/20 border border-rose-500/30 px-2 py-0.5 text-xs font-bold text-rose-400">
                    {t('discount')} -{discount}%
                  </span>
                )}
              </div>

              {product.description && (
                <p className="mt-4 text-xs sm:text-sm leading-relaxed text-white/70 dark:text-white/70 not-dark:text-slate-600">
                  {product.description}
                </p>
              )}

              <div className="mt-5 space-y-2.5 rounded-2xl border border-white/10 bg-black/40 p-3.5 dark:bg-black/40 dark:border-white/10 not-dark:bg-slate-50 not-dark:border-slate-200">
                <div className="flex items-center gap-2 text-xs font-medium text-white/85 dark:text-white/85 not-dark:text-slate-700">
                  <ShieldCheck size={16} className="text-[#ffb442] shrink-0" />
                  <span>{t('authenticSeal')}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-white/85 dark:text-white/85 not-dark:text-slate-700">
                  <Truck size={16} className="text-[#ffb442] shrink-0" />
                  <span>{t('delivery58')}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-white/85 dark:text-white/85 not-dark:text-slate-700">
                  <CheckCircle2 size={16} className="text-[#ffb442] shrink-0" />
                  <span>{t('codPayment')}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOrder(product);
                }}
                className="flex w-full sm:flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ffb442] to-[#ffd07f] px-5 py-3 text-sm font-bold text-[#241500] shadow-lg shadow-[#ffb442]/20 transition-all hover:brightness-105 active:scale-[0.98]"
              >
                <MessageCircle size={17} />
                <span>{t('orderWhatsAppCta')}</span>
              </button>

              <button
                type="button"
                onClick={() => onShare(product)}
                aria-label={t('shareProduct')}
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-semibold text-white/80 hover:border-[#ffb442]/50 hover:text-[#ffb442] transition-colors dark:border-white/10 dark:bg-white/5 not-dark:border-slate-200 not-dark:bg-slate-100 not-dark:text-slate-700"
              >
                <Share2 size={15} />
                <span className="sm:hidden">{t('shareProduct')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-black/95 p-2 sm:p-6 backdrop-blur-2xl select-none animate-in fade-in duration-200"
        >
          <div className="absolute top-4 inset-x-4 flex items-center justify-between text-white z-10">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold luxury-serif text-white/90">
                {product.name}
              </span>
              <span className="rounded-md border border-white/20 bg-white/10 px-2 py-0.5 font-mono text-xs text-white/70">
                {product.volume}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsZoomed((prev) => !prev)}
                className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:border-[#ffb442] hover:text-[#ffb442] transition-colors"
              >
                {isZoomed ? <ZoomOut size={15} /> : <ZoomIn size={15} />}
                <span>{isZoomed ? t('zoomFit') : t('zoomMagnify')}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsLightboxOpen(false);
                  setIsZoomed(false);
                }}
                aria-label={t('close')}
                className="flex size-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePrev}
            aria-label={t('prevProduct')}
            className="absolute start-4 top-1/2 -translate-y-1/2 z-10 flex size-12 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white/80 hover:border-[#ffb442] hover:text-[#ffb442] hover:bg-black/90 transition-all"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label={t('nextProduct')}
            className="absolute end-4 top-1/2 -translate-y-1/2 z-10 flex size-12 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white/80 hover:border-[#ffb442] hover:text-[#ffb442] hover:bg-black/90 transition-all"
          >
            <ChevronRight size={24} />
          </button>

          <div
            onClick={() => setIsZoomed((prev) => !prev)}
            className="flex size-full items-center justify-center overflow-auto p-4 cursor-pointer"
          >
            <img
              src={product.image}
              alt={product.name}
              className={`max-h-[86vh] max-w-[90vw] object-contain transition-transform duration-300 ease-out shadow-2xl ${
                isZoomed
                  ? 'scale-[1.85] cursor-zoom-out'
                  : 'scale-100 cursor-zoom-in'
              }`}
            />
          </div>
        </div>
      )}
    </>
  );
}
