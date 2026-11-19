import { useLanguage } from '../context/LanguageContext';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  const { language, t } = useLanguage();

  const getCategoryLabel = (cat: string) => {
    if (language === 'fr') {
      const mapping: Record<string, string> = {
        'عساف': 'Assaf',
        'إبراق': 'Ibraq',
        'هيرش': 'Hersh',
        'شرقي': 'Oriental',
      };
      return mapping[cat] || cat;
    }
    return cat;
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2 no-scrollbar">
      <button
        type="button"
        onClick={() => onSelectCategory('all')}
        className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
          selectedCategory === 'all'
            ? 'bg-[#ffb442] text-[#241500] shadow-sm shadow-[#ffb442]/20 font-bold'
            : 'border border-white/10 bg-[#14171c] text-white/75 hover:border-[#ffb442]/30 hover:text-white dark:bg-[#14171c] dark:border-white/10 dark:text-white/75 not-dark:bg-white not-dark:border-slate-200 not-dark:text-slate-600 not-dark:hover:border-slate-300'
        }`}
      >
        {t('allCategories')}
      </button>

      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onSelectCategory(cat)}
          className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
            selectedCategory === cat
              ? 'bg-[#ffb442] text-[#241500] shadow-sm shadow-[#ffb442]/20 font-bold'
              : 'border border-white/10 bg-[#14171c] text-white/75 hover:border-[#ffb442]/30 hover:text-white dark:bg-[#14171c] dark:border-white/10 dark:text-white/75 not-dark:bg-white not-dark:border-slate-200 not-dark:text-slate-600 not-dark:hover:border-slate-300'
          }`}
        >
          {getCategoryLabel(cat)}
        </button>
      ))}
    </div>
  );
}
