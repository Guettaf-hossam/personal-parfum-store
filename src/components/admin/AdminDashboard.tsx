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
    <div className="min-h-screen bg-[#0b0d10] text-white dark:bg-[#0b0d10] not-dark:bg-slate-50 not-dark:text-slate-900 pb-20">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#14171c]/95 px-4 py-3 backdrop-blur-md dark:bg-[#14171c]/95 dark:border-white/10 not-dark:bg-white/95 not-dark:border-slate-200">
        <div className="container-shell flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="luxury-serif text-lg font-bold text-white dark:text-white not-dark:text-slate-900 sm:text-xl">
              {t('adminTitle')}
            </h1>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-white/60 dark:text-white/60 not-dark:text-slate-500">
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
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:text-white hover:border-white/30 transition-colors dark:border-white/10 dark:text-white/80 not-dark:border-slate-300 not-dark:bg-slate-100 not-dark:text-slate-700"
            >
              <Store size={15} />
              <span className="hidden sm:inline">{t('viewStore')}</span>
            </a>

            <button
              type="button"
              onClick={handleSignOut}
              title={t('signOut')}
              className="flex size-9 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="container-shell mt-6">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="size-8 animate-spin rounded-full border-2 border-[#ffb442] border-t-transparent" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className={`relative flex flex-col overflow-hidden rounded-2xl border bg-[#14171c] shadow-md transition-all dark:bg-[#14171c] not-dark:bg-white ${
                  product.is_active
                    ? 'border-white/10 dark:border-white/10 not-dark:border-slate-200'
                    : 'border-white/5 opacity-60 dark:border-white/5 not-dark:border-slate-200'
                }`}
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#0b0d10]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="size-full object-cover"
                  />

                  <span
                    className={`absolute start-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      product.is_active
                        ? 'bg-emerald-500/90 text-white shadow-sm'
                        : 'bg-zinc-700/90 text-zinc-300'
                    }`}
                  >
                    {product.is_active ? t('statusActive') : t('statusHidden')}
                  </span>

                  <span className="absolute bottom-2 start-2 rounded-md bg-black/60 px-1.5 py-0.5 font-mono text-[9px] text-white/80 backdrop-blur-sm">
                    {product.volume}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-3">
                  <span className="text-[10px] font-medium text-white/50 dark:text-white/50 not-dark:text-slate-500">
                    {product.category}
                  </span>
                  <h3 className="line-clamp-1 text-xs font-bold text-white dark:text-white not-dark:text-slate-900 sm:text-sm">
                    {product.name}
                  </h3>

                  <div className="mt-1.5 flex items-baseline gap-1.5">
                    <span className="text-xs font-black text-[#ffb442] sm:text-sm">
                      {formatPrice(product.price, language)}
                    </span>
                    {product.old_price && (
                      <span className="text-[10px] text-white/40 line-through dark:text-white/40 not-dark:text-slate-400">
                        {formatPrice(product.old_price, language)}
                      </span>
                    )}
                  </div>

                  <div className="mt-auto pt-3 grid grid-cols-4 gap-1 border-t border-white/10 dark:border-white/10 not-dark:border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleDelete(product.id)}
                      title="حذف"
                      className="flex h-8 items-center justify-center rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleEditClick(product)}
                      title="تعديل"
                      className="flex h-8 items-center justify-center rounded-lg text-[#ffb442] hover:bg-[#ffb442]/10 transition-colors"
                    >
                      <Pencil size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleActive(product)}
                      title={product.is_active ? 'إخفاء' : 'إظهار'}
                      className="flex h-8 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors dark:text-white/70 not-dark:text-slate-600"
                    >
                      {product.is_active ? <Eye size={15} /> : <EyeOff size={15} className="text-zinc-500" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleShare(product)}
                      title="مشاركة الرابط"
                      className="flex h-8 items-center justify-center rounded-lg text-sky-400 hover:bg-sky-500/10 transition-colors"
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
