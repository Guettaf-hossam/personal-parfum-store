import { useCallback, useEffect, useMemo, useState } from 'react';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLogin } from './components/admin/AdminLogin';
import { CategoryFilter } from './components/CategoryFilter';
import { OrderModal } from './components/OrderModal';
import { ProductCard } from './components/ProductCard';
import { SiteFooter } from './components/SiteFooter';
import { SiteHeader } from './components/SiteHeader';
import { Toast } from './components/Toast';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { SEED_PRODUCTS } from './data/products';
import { getActiveProducts, isSupabaseConfigured, supabase } from './lib/supabase';
import { Product } from './types';

function Storefront() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedOrderProduct, setSelectedOrderProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    void getActiveProducts().then((data) => {
      if (data && data.length > 0) {
        setProducts(data);
      }
    });
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#product-')) {
      const el = document.querySelector(hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 300);
      }
    }
  }, [products]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  }, []);

  const handleShare = useCallback((product: Product) => {
    const url = `${window.location.origin}/#product-${product.id}`;
    if (navigator.clipboard) {
      void navigator.clipboard.writeText(url);
      showToast(t('linkCopied'));
    }
  }, [t, showToast]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0b0d10] text-white dark:bg-[#0b0d10] dark:text-white not-dark:bg-[#f8fafc] not-dark:text-slate-900 transition-colors duration-200 flex flex-col justify-between">
      <div>
        <SiteHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isSearchOpen={isSearchOpen}
          onToggleSearch={() => setIsSearchOpen((prev) => !prev)}
        />

        <main className="container-shell mt-4 sm:mt-6">
          <div className="mb-4 sm:mb-6">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          {filteredProducts.length === 0 ? (
            <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-3xl border border-white/5 bg-[#14171c]/50 p-8 text-center dark:bg-[#14171c]/50 not-dark:bg-white not-dark:border-slate-200">
              <span className="text-3xl mb-2">✦</span>
              <p className="text-sm font-semibold text-white/70 dark:text-white/70 not-dark:text-slate-600">
                {t('emptyCatalog')}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="mt-4 rounded-xl bg-[#ffb442] px-4 py-2 text-xs font-bold text-[#241500]"
              >
                {t('allCategories')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOrder={(p) => setSelectedOrderProduct(p)}
                  onShare={handleShare}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <SiteFooter />

      <OrderModal
        product={selectedOrderProduct}
        onClose={() => setSelectedOrderProduct(null)}
      />

      <Toast message={toastMessage} />
    </div>
  );
}

function AdminApp() {
  const [session, setSession] = useState<unknown | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setSession({ user: { email: 'admin@local' } });
      setChecking(false);
      return;
    }

    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0d10]">
        <div className="size-8 animate-spin rounded-full border-2 border-[#ffb442] border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    return <AdminLogin onLoginSuccess={() => setSession({})} />;
  }

  return <AdminDashboard onSignOut={() => setSession(null)} />;
}

export function App() {
  const isAdminRoute =
    window.location.pathname.startsWith('/admin') ||
    window.location.hash.startsWith('#admin');

  return (
    <ThemeProvider>
      <LanguageProvider>
        {isAdminRoute ? <AdminApp /> : <Storefront />}
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
