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
            ? 'bg-[#b87a14] text-white shadow-sm font-bold dark:bg-[#ffb442] dark:text-[#241500] dark:shadow-[#ffb442]/20'
            : 'border border-stone-200 bg-white text-stone-600 shadow-sm hover:border-[#b87a14]/40 hover:text-stone-900 dark:border-white/10 dark:bg-[#14171c] dark:text-white/75 dark:shadow-none dark:hover:border-[#ffb442]/30 dark:hover:text-white'
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
              ? 'bg-[#b87a14] text-white shadow-sm font-bold dark:bg-[#ffb442] dark:text-[#241500] dark:shadow-[#ffb442]/20'
              : 'border border-stone-200 bg-white text-stone-600 shadow-sm hover:border-[#b87a14]/40 hover:text-stone-900 dark:border-white/10 dark:bg-[#14171c] dark:text-white/75 dark:shadow-none dark:hover:border-[#ffb442]/30 dark:hover:text-white'
          }`}
        >
          {getCategoryLabel(cat)}
        </button>
      ))}
    </div>
  );
}
