import { MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { STORE_CONFIG } from '../data/store';

export function SiteFooter() {
  const { language } = useLanguage();
  const brandName = language === 'ar' ? STORE_CONFIG.storeNameAr : STORE_CONFIG.storeNameFr;

  return (
    <footer className="mt-16 border-t border-white/10 bg-[#0b0d10] py-8 text-white/60 dark:bg-[#0b0d10] dark:border-white/10 not-dark:bg-slate-100 not-dark:border-slate-200 not-dark:text-slate-600">
      <div className="container-shell flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-[#ffb442] text-[#241500] text-xs font-bold">
            ✦
          </span>
          <span className="luxury-serif text-sm font-bold text-white dark:text-white not-dark:text-slate-900">
            {brandName}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <a
            href="https://wa.me/213781868538"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-white/80 hover:text-[#ffb442] transition-colors dark:text-white/80 not-dark:text-slate-700"
          >
            <MessageCircle size={14} className="text-[#ffb442]" />
            <span dir="ltr" className="font-mono tracking-wide">+213 781 86 85 38</span>
          </a>
        </div>

        <span className="text-[11px] text-white/40 dark:text-white/40 not-dark:text-slate-400">
          © {new Date().getFullYear()} {brandName}.
        </span>
      </div>
    </footer>
  );
}
