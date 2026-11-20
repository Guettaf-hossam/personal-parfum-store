import { useCallback, useEffect, useMemo, useState } from 'react';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLogin } from './components/admin/AdminLogin';
import { CategoryFilter } from './components/CategoryFilter';
import { OrderModal } from './components/OrderModal';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
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
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    void getActiveProducts().then((data) => {
      if (data && data.length > 0) {
        setProducts(data);
      }
    });
  }, []);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#product-')) {
        const prodId = hash.replace('#product-', '');
        const found = products.find((p) => p.id === prodId);
        if (found) {
          setSelectedDetailProduct(found);
          const el = document.getElementById(`product-${prodId}`);
          if (el) {
            setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 300);
          }
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
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
    <div className="min-h-screen bg-[#f6f3ee] text-[#181512] transition-colors duration-200 flex flex-col justify-between dark:bg-[#08090c] dark:text-[#f5f3ef]">
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
            <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-3xl border border-stone-200 bg-white/70 p-8 text-center shadow-sm dark:border-white/5 dark:bg-[#14171c]/50">
              <span className="text-3xl mb-2 text-[#b87a14] dark:text-[#ffb442]">✦</span>
              <p className="text-sm font-semibold text-stone-600 dark:text-white/70">
                {t('emptyCatalog')}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="mt-4 rounded-xl bg-[#b87a14] px-4 py-2 text-xs font-bold text-white transition-all hover:brightness-105 dark:bg-[#ffb442] dark:text-[#241500]"
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
                  onViewDetails={(p) => setSelectedDetailProduct(p)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <SiteFooter />

      <ProductDetailModal
        product={selectedDetailProduct}
        products={filteredProducts.length > 0 ? filteredProducts : products}
        onClose={() => setSelectedDetailProduct(null)}
        onOrder={(p) => {
          setSelectedDetailProduct(null);
          setSelectedOrderProduct(p);
        }}
        onShare={handleShare}
        onSelectProduct={(p) => setSelectedDetailProduct(p)}
      />

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
      <div className="flex min-h-screen items-center justify-center bg-[#f6f3ee] dark:bg-[#08090c]">
        <div className="size-8 animate-spin rounded-full border-2 border-[#b87a14] border-t-transparent dark:border-[#ffb442]" />
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
