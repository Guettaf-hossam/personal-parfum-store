import { MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { STORE_CONFIG } from '../data/store';
import { BrandLogo } from './BrandLogo';

export function SiteFooter() {
  const { language } = useLanguage();
  const brandName = language === 'ar' ? STORE_CONFIG.storeNameAr : STORE_CONFIG.storeNameFr;

  return (
    <footer className="mt-16 border-t border-stone-200 bg-white py-8 text-stone-600 dark:border-white/10 dark:bg-[#0b0d10] dark:text-white/60">
      <div className="container-shell flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <BrandLogo size={28} />
          <span className="luxury-serif text-sm font-bold text-[#181512] dark:text-white">
            {brandName}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <a
            href="https://wa.me/213781868538"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-stone-700 hover:text-[#b87a14] dark:text-white/80 dark:hover:text-[#ffb442] transition-colors"
          >
            <MessageCircle size={14} className="text-[#b87a14] dark:text-[#ffb442]" />
            <span dir="ltr" className="font-mono tracking-wide">+213 781 86 85 38</span>
          </a>
        </div>

        <span className="text-[11px] text-stone-400 dark:text-white/40">
          © {new Date().getFullYear()} {brandName}.
        </span>
      </div>
    </footer>
  );
}