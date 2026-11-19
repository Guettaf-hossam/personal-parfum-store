import { Share2, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Product } from '../types';
import { calculateDiscount, formatPrice } from '../utils/formatting';

interface ProductCardProps {
  product: Product;
  onOrder: (product: Product) => void;
  onShare: (product: Product) => void;
}

export function ProductCard({ product, onOrder, onShare }: ProductCardProps) {
  const { language, t } = useLanguage();

  const discount = calculateDiscount(product.price, product.old_price);

  return (
    <article
      id={`product-${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#14171c] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[#ffb442]/50 hover:shadow-xl hover:shadow-[#ffb442]/5 dark:bg-[#14171c] dark:border-white/10 not-dark:bg-white not-dark:border-slate-200 not-dark:shadow-sm not-dark:hover:border-slate-300"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#0b0d10] dark:bg-[#0b0d10] not-dark:bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {product.is_featured && (
          <span className="absolute start-2.5 top-2.5 flex items-center gap-1 rounded-full border border-[#ffb442]/40 bg-[#0b0d10]/80 px-2 py-0.5 text-[10px] font-bold text-[#ffb442] backdrop-blur-md">
            <Star size={11} className="fill-[#ffb442] text-[#ffb442]" />
            <span>{t('featuredBadge')}</span>
          </span>
        )}

        {discount && (
          <span className="absolute end-2.5 top-2.5 rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
            -{discount}%
          </span>
        )}

        <span className="absolute bottom-2.5 start-2.5 rounded-md border border-white/15 bg-black/60 px-2 py-0.5 font-mono text-[10px] font-semibold text-white/90 backdrop-blur-sm">
          {product.volume}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <span className="text-[11px] font-medium text-white/50 dark:text-white/50 not-dark:text-slate-500">
          {product.category}
        </span>

        <h3 className="luxury-serif mt-1 line-clamp-2 text-sm font-bold text-white dark:text-white not-dark:text-slate-900 sm:text-base">
          {product.name}
        </h3>

        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-base font-extrabold text-[#ffb442] sm:text-lg">
            {formatPrice(product.price, language)}
          </span>
          {product.old_price && product.old_price > product.price && (
            <span className="text-xs text-white/40 line-through dark:text-white/40 not-dark:text-slate-400">
              {formatPrice(product.old_price, language)}
            </span>
          )}
        </div>

        <div className="mt-auto pt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onOrder(product)}
            className="flex-1 rounded-xl bg-[#ffb442] px-3 py-2 text-xs font-bold text-[#241500] shadow-sm transition-all hover:bg-[#ffc164] active:scale-95 sm:text-sm"
          >
            {t('orderNow')}
          </button>

          <button
            type="button"
            onClick={() => onShare(product)}
            aria-label={t('share')}
            className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/75 hover:border-[#ffb442]/40 hover:text-[#ffb442] transition-colors dark:border-white/10 dark:bg-white/5 dark:text-white/75 not-dark:border-slate-200 not-dark:bg-slate-100 not-dark:text-slate-600 not-dark:hover:text-slate-900"
          >
            <Share2 size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}
