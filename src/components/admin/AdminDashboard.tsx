import { Eye, EyeOff, LogOut, Pencil, Plus, Share2, Store, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { deleteProduct, getAllProductsAdmin, supabase, toggleProductActive } from '../../lib/supabase';
import { Product } from '../../types';
import { formatPrice } from '../../utils/formatting';
import { Toast } from '../Toast';
import { ProductFormModal } from './ProductFormModal';

interface AdminDashboardProps {
  onSignOut: () => void;
}

export function AdminDashboard({ onSignOut }: AdminDashboardProps) {
  const { language, t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    const data = await getAllProductsAdmin();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    void loadProducts();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onSignOut();
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('deleteConfirm'))) {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast('تم حذف المنتج');
    }
  };

  const handleToggleActive = async (product: Product) => {
    const updated = await toggleProductActive(product.id, product.is_active);
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, is_active: updated } : p))
    );
    showToast(updated ? 'المنتج نشط الآن' : 'تم إخفاء المنتج');
  };

  const handleShare = (product: Product) => {
    const url = `${window.location.origin}/#product-${product.id}`;
    if (navigator.clipboard) {
      void navigator.clipboard.writeText(url);
      showToast(t('linkCopied'));
    }
  };

  const handleAddClick = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaved = (saved: Product) => {
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [saved, ...prev];
    });
    showToast('تم حفظ المنتج بنجاح');
  };

  return (
    <div className="min-h-screen bg-stone-50 text-[#181512] dark:bg-[#0b0d10] dark:text-white pb-20">
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/95 px-4 py-3 backdrop-blur-md dark:border-white/10 dark:bg-[#14171c]/95">
        <div className="container-shell flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="luxury-serif text-lg font-bold text-[#181512] dark:text-white sm:text-xl">
              {t('adminTitle')}
            </h1>
            <span className="rounded-full border border-stone-200 bg-stone-100 px-2.5 py-0.5 text-xs text-stone-600 dark:border-white/10 dark:bg-white/5 dark:text-white/60">
              {t('productsCount', { count: products.length })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddClick}
              className="flex items-center gap-1.5 rounded-xl bg-[#ffb442] px-3.5 py-2 text-xs font-bold text-[#241500] shadow-sm hover:bg-[#ffc164] transition-all active:scale-95 sm:text-sm"
            >
              <Plus size={16} />
              <span>{t('addNewProduct')}</span>
            </button>

            <a
              href="/"
              className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-100 px-3 py-2 text-xs font-semibold text-stone-700 hover:text-stone-900 hover:border-stone-300 transition-colors dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:text-white"
            >
              <Store size={15} />
              <span className="hidden sm:inline">{t('viewStore')}</span>
            </a>

            <button
              type="button"
              onClick={handleSignOut}
              title={t('signOut')}
              className="flex size-9 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-colors dark:text-rose-400"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="container-shell mt-6">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="size-8 animate-spin rounded-full border-2 border-[#b87a14] dark:border-[#ffb442] border-t-transparent" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className={`relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-md transition-all dark:bg-[#14171c] ${
                  product.is_active
                    ? 'border-stone-200 dark:border-white/10'
                    : 'border-stone-200/60 opacity-60 dark:border-white/5'
                }`}
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-100 dark:bg-[#0b0d10]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="size-full object-cover"
                  />

                  <span
                    className={`absolute start-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      product.is_active
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-zinc-600 text-zinc-100'
                    }`}
                  >
                    {product.is_active ? t('statusActive') : t('statusHidden')}
                  </span>

                  <span dir="ltr" className="absolute bottom-2 start-2 rounded-md bg-black/60 px-1.5 py-0.5 font-mono text-[9px] text-white/90 backdrop-blur-sm">
                    {product.volume}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-3">
                  <span className="text-[10px] font-medium text-stone-500 dark:text-white/50">
                    {product.category}
                  </span>
                  <h3 className="line-clamp-1 text-xs font-bold text-[#181512] dark:text-white sm:text-sm">
                    {product.name}
                  </h3>

                  <div className="mt-1.5 flex items-baseline gap-1.5">
                    <span className="text-xs font-black text-[#b87a14] dark:text-[#ffb442] sm:text-sm">
                      {formatPrice(product.price, language)}
                    </span>
                    {product.old_price && (
                      <span className="text-[10px] text-stone-400 line-through dark:text-white/40">
                        {formatPrice(product.old_price, language)}
                      </span>
                    )}
                  </div>

                  <div className="mt-auto pt-3 grid grid-cols-4 gap-1 border-t border-stone-100 dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => handleDelete(product.id)}
                      title="حذف"
                      className="flex h-8 items-center justify-center rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleEditClick(product)}
                      title="تعديل"
                      className="flex h-8 items-center justify-center rounded-lg text-[#b87a14] dark:text-[#ffb442] hover:bg-[#ffb442]/10 transition-colors"
                    >
                      <Pencil size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleActive(product)}
                      title={product.is_active ? 'إخفاء' : 'إظهار'}
                      className="flex h-8 items-center justify-center rounded-lg text-stone-600 hover:bg-stone-100 dark:text-white/70 dark:hover:bg-white/10 transition-colors"
                    >
                      {product.is_active ? <Eye size={15} /> : <EyeOff size={15} className="text-stone-400 dark:text-zinc-500" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleShare(product)}
                      title="مشاركة الرابط"
                      className="flex h-8 items-center justify-center rounded-lg text-sky-600 dark:text-sky-400 hover:bg-sky-500/10 transition-colors"
                    >
                      <Share2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {isModalOpen && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSaved}
        />
      )}

      <Toast message={toastMessage} />
    </div>
  );
}