import { Moon, Search, Sun, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { STORE_CONFIG } from '../data/store';
import { BrandLogo } from './BrandLogo';

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
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 bg-white/95 text-[#181512] backdrop-blur-md transition-colors duration-200 dark:border-white/10 dark:bg-[#111318]/95 dark:text-[#f5f3ef]">
      <div className="container-shell flex h-16 items-center justify-between gap-3">
        <a href="/" className="flex items-center gap-2.5 group">
          <BrandLogo size={34} className="transition-transform group-hover:scale-105" />
          <span className="luxury-serif text-lg font-bold tracking-tight text-[#181512] transition-colors group-hover:text-[#b87a14] dark:text-[#f5f3ef] dark:group-hover:text-[#ffb442] sm:text-xl">
            {brandName}
          </span>
        </a>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={onToggleSearch}
            aria-label="Search"
            className="flex size-9 items-center justify-center rounded-full border border-stone-200 bg-stone-100 text-stone-700 transition-colors hover:border-[#b87a14]/50 hover:text-[#b87a14] dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-[#ffb442]/50 dark:hover:text-[#ffb442]"
          >
            {isSearchOpen ? <X size={17} /> : <Search size={17} />}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex size-9 items-center justify-center rounded-full border border-stone-200 bg-stone-100 text-stone-700 transition-colors hover:border-[#b87a14]/50 hover:text-[#b87a14] dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-[#ffb442]/50 dark:hover:text-[#ffb442]"
          >
            {theme === 'dark' ? <Sun size={17} className="text-[#ffb442]" /> : <Moon size={17} className="text-[#b87a14]" />}
          </button>

          <div className="flex items-center rounded-full border border-stone-200 bg-stone-100 p-0.5 dark:border-white/10 dark:bg-white/5">
            <button
              type="button"
              onClick={() => setLanguage('ar')}
              className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-all ${
                language === 'ar'
                  ? 'bg-[#b87a14] text-white shadow-sm dark:bg-[#ffb442] dark:text-[#241500]'
                  : 'text-stone-600 hover:text-stone-900 dark:text-white/70 dark:hover:text-white'
              }`}
            >
              عربي
            </button>
            <button
              type="button"
              onClick={() => setLanguage('fr')}
              className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-all ${
                language === 'fr'
                  ? 'bg-[#b87a14] text-white shadow-sm dark:bg-[#ffb442] dark:text-[#241500]'
                  : 'text-stone-600 hover:text-stone-900 dark:text-white/70 dark:hover:text-white'
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
              className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-2.5 pe-10 text-sm text-[#181512] placeholder-stone-400 focus:border-[#b87a14] focus:outline-none dark:border-[#ffb442]/30 dark:bg-[#14171c] dark:text-white dark:placeholder-white/40 dark:focus:border-[#ffb442]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-800 dark:text-white/50 dark:hover:text-white"
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
