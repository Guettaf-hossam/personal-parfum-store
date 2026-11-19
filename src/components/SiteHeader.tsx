import { Moon, Search, Sun, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { STORE_CONFIG } from '../data/store';

interface SiteHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isSearchOpen: boolean;
  onToggleSearch: () => void;
}

export function SiteHeader({
  searchQuery,
  onSearchChange,
  isSearchOpen,
  onToggleSearch,
}: SiteHeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const brandName = language === 'ar' ? STORE_CONFIG.storeNameAr : STORE_CONFIG.storeNameFr;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0b0d10]/95 backdrop-blur-md transition-colors duration-200 dark:bg-[#0b0d10]/95 dark:border-white/10 dark:text-white not-dark:bg-white/95 not-dark:border-slate-200 not-dark:text-slate-900">
      <div className="container-shell flex h-16 items-center justify-between gap-3">
        <a href="/" className="flex items-center gap-2 group">
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#ffb442] to-[#ffd07f] text-[#241500] font-bold shadow-md shadow-[#ffb442]/20">
            ✦
          </span>
          <span className="luxury-serif text-lg font-bold tracking-tight text-white dark:text-white not-dark:text-slate-900 group-hover:text-[#ffb442] transition-colors sm:text-xl">
            {brandName}
          </span>
        </a>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={onToggleSearch}
            aria-label="Search"
            className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/90 hover:border-[#ffb442]/50 hover:text-[#ffb442] transition-colors dark:border-white/10 dark:bg-white/5 dark:text-white not-dark:border-slate-200 not-dark:bg-slate-100 not-dark:text-slate-700"
          >
            {isSearchOpen ? <X size={17} /> : <Search size={17} />}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/90 hover:border-[#ffb442]/50 hover:text-[#ffb442] transition-colors dark:border-white/10 dark:bg-white/5 dark:text-white not-dark:border-slate-200 not-dark:bg-slate-100 not-dark:text-slate-700"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <div className="flex items-center rounded-full border border-white/10 bg-white/5 p-0.5 dark:border-white/10 dark:bg-white/5 not-dark:border-slate-200 not-dark:bg-slate-100">
            <button
              type="button"
              onClick={() => setLanguage('ar')}
              className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-all ${
                language === 'ar'
                  ? 'bg-[#ffb442] text-[#241500] shadow-sm'
                  : 'text-white/70 hover:text-white dark:text-white/70 dark:hover:text-white not-dark:text-slate-600 not-dark:hover:text-slate-900'
              }`}
            >
              عربي
            </button>
            <button
              type="button"
              onClick={() => setLanguage('fr')}
              className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-all ${
                language === 'fr'
                  ? 'bg-[#ffb442] text-[#241500] shadow-sm'
                  : 'text-white/70 hover:text-white dark:text-white/70 dark:hover:text-white not-dark:text-slate-600 not-dark:hover:text-slate-900'
              }`}
            >
              FR
            </button>
          </div>
        </div>
      </div>

      {isSearchOpen && (
        <div className="container-shell pb-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t('searchPlaceholder')}
              autoFocus
              className="w-full rounded-2xl border border-[#ffb442]/30 bg-[#14171c] px-4 py-2.5 pe-10 text-sm text-white placeholder-white/40 focus:border-[#ffb442] focus:outline-none dark:bg-[#14171c] dark:text-white not-dark:bg-slate-100 not-dark:text-slate-900 not-dark:placeholder-slate-400 not-dark:border-slate-300"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white not-dark:text-slate-500 not-dark:hover:text-slate-800"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
