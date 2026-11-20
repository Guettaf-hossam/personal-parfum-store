import { Upload, X } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { uploadProductImage, upsertProduct } from '../../lib/supabase';
import { Product } from '../../types';
import { compressImageToWebp } from '../../utils/image';

interface ProductFormModalProps {
  product: Product | null;
  onClose: () => void;
  onSuccess: (saved: Product) => void;
}

const VOLUMES = ['100 ml', '150 ml', '200 ml'];
const DEFAULT_CATEGORIES = ['عساف', 'هيرش', 'إبراق', 'شرقي'];

export function ProductFormModal({ product, onClose, onSuccess }: ProductFormModalProps) {
  const { t } = useLanguage();

  const [name, setName] = useState(product?.name ?? '');
  const [volume, setVolume] = useState(product?.volume ?? '100 ml');
  const [category, setCategory] = useState(product?.category ?? 'عساف');
  const [price, setPrice] = useState(product?.price ? String(product.price) : '');
  const [oldPrice, setOldPrice] = useState(product?.old_price ? String(product.old_price) : '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [imageUrl, setImageUrl] = useState(product?.image ?? '');
  const [isFeatured, setIsFeatured] = useState(product?.is_featured ?? false);
  const [isActive, setIsActive] = useState(product?.is_active ?? true);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMsg(null);
    try {
      const compressedBlob = await compressImageToWebp(file, 900, 0.82);
      const fileName = `${file.name.replace(/\.[^/.]+$/, '')}.webp`;
      const publicUrl = await uploadProductImage(compressedBlob, fileName);
      setImageUrl(publicUrl);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (!price || Number(price) <= 0) return;
    if (!imageUrl) {
      setErrorMsg('Image is required');
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    try {
      const payload: Partial<Product> & { name: string; price: number; image: string } = {
        name: name.trim(),
        volume,
        category: category.trim(),
        price: Number(price),
        old_price: oldPrice ? Number(oldPrice) : null,
        description: description.trim() || null,
        image: imageUrl,
        is_featured: isFeatured,
        is_active: isActive,
      };

      if (product?.id) {
        payload.id = product.id;
      }

      const saved = await upsertProduct(payload);
      if (saved) {
        onSuccess(saved);
      } else {
        onSuccess({
          id: product?.id ?? `local-${Date.now()}`,
          name: payload.name,
          volume: payload.volume ?? '100 ml',
          category: payload.category ?? 'عساف',
          price: payload.price,
          old_price: payload.old_price,
          description: payload.description,
          image: payload.image,
          is_featured: payload.is_featured ?? false,
          is_active: payload.is_active ?? true,
        });
      }
      onClose();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-5 backdrop-blur-sm overflow-y-auto"
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl border border-stone-200 bg-white text-[#181512] shadow-2xl dark:border-white/10 dark:bg-[#14171c] dark:text-white"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-200 bg-white/95 px-5 py-4 backdrop-blur-md dark:border-white/10 dark:bg-[#14171c]/95">
          <h2 className="text-base font-bold text-[#181512] dark:text-white">
            {product ? t('editProduct') : t('addNewProduct')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 hover:text-stone-800 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {errorMsg && (
          <div className="mx-5 mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-500 dark:text-rose-400">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block mb-1.5 text-xs font-semibold text-stone-700 dark:text-white/80">
              {t('productName')}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: عطر فرانكل أسكوت"
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-[#181512] placeholder-stone-400 focus:border-[#b87a14] focus:outline-none dark:border-white/10 dark:bg-[#0b0d10] dark:text-white dark:placeholder-white/30 dark:focus:border-[#ffb442]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-stone-700 dark:text-white/80">
                {t('volume')}
              </label>
              <select
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                dir="ltr"
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-[#181512] focus:border-[#b87a14] focus:outline-none dark:border-white/10 dark:bg-[#0b0d10] dark:text-white dark:focus:border-[#ffb442]"
              >
                {VOLUMES.map((v) => (
                  <option key={v} value={v} className="bg-white text-stone-900 dark:bg-[#0b0d10] dark:text-white">
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-semibold text-stone-700 dark:text-white/80">
                {t('category')}
              </label>
              <input
                type="text"
                required
                list="category-suggestions"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="عساف / هيرش / إبراق / شرقي"
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-[#181512] placeholder-stone-400 focus:border-[#b87a14] focus:outline-none dark:border-white/10 dark:bg-[#0b0d10] dark:text-white dark:placeholder-white/30 dark:focus:border-[#ffb442]"
              />
              <datalist id="category-suggestions">
                {DEFAULT_CATEGORIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-stone-700 dark:text-white/80">
                {t('priceDzd')}
              </label>
              <input
                type="number"
                required
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="11500"
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-[#181512] placeholder-stone-400 focus:border-[#b87a14] focus:outline-none dark:border-white/10 dark:bg-[#0b0d10] dark:text-white dark:placeholder-white/30 dark:focus:border-[#ffb442]"
              />
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-semibold text-stone-700 dark:text-white/80">
                {t('oldPriceDzd')}
              </label>
              <input
                type="number"
                min="0"
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
                placeholder="13000"
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-[#181512] placeholder-stone-400 focus:border-[#b87a14] focus:outline-none dark:border-white/10 dark:bg-[#0b0d10] dark:text-white dark:placeholder-white/30 dark:focus:border-[#ffb442]"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-stone-700 dark:text-white/80">
              {t('description')}
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="وصف مختصر للمكونات والنفحات العطرية..."
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-[#181512] placeholder-stone-400 focus:border-[#b87a14] focus:outline-none dark:border-white/10 dark:bg-[#0b0d10] dark:text-white dark:placeholder-white/30 dark:focus:border-[#ffb442]"
            />
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-stone-700 dark:text-white/80">
              {t('imageLabel')}
            </label>

            <div className="flex items-center gap-3">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="size-16 rounded-xl object-cover border border-stone-200 bg-stone-100 dark:border-white/10 dark:bg-black/40"
                />
              ) : (
                <div className="flex size-16 items-center justify-center rounded-xl border border-dashed border-stone-300 bg-stone-100 text-stone-400 dark:border-white/20 dark:bg-white/5 dark:text-white/30">
                  <Upload size={20} />
                </div>
              )}

              <div className="flex-1 space-y-1.5">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-stone-200 bg-stone-100 px-3 py-2 text-xs font-semibold text-stone-700 hover:border-[#b87a14] hover:text-[#b87a14] transition-colors dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-[#ffb442] dark:hover:text-[#ffb442]">
                  <Upload size={14} />
                  <span>{uploading ? 'جاري الضغط والرفع...' : t('uploadImage')}</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageFile}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="/products/... أو رابط خارجي"
                  className="w-full rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-xs text-stone-700 focus:border-[#b87a14] focus:outline-none dark:border-white/10 dark:bg-[#0b0d10] dark:text-white/70 dark:focus:border-[#ffb442]"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 p-3 dark:border-white/10 dark:bg-white/5">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800 dark:text-white">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="size-4 rounded accent-[#ffb442]"
              />
              <span>{t('featuredProduct')}</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800 dark:text-white">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="size-4 rounded accent-[#ffb442]"
              />
              <span>{t('activeProduct')}</span>
            </label>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex-1 rounded-xl bg-[#ffb442] py-3 text-sm font-bold text-[#241500] hover:bg-[#ffc164] transition-all disabled:opacity-50"
            >
              {saving ? '...' : t('saveProduct')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-stone-200 px-4 py-3 text-sm font-semibold text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors dark:border-white/10 dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-white"
            >
              {t('cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}