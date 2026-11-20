import { Eye, EyeOff, Lock, Mail, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import { BrandLogo } from '../BrandLogo';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!isSupabaseConfigured) {
      setErrorMsg(t('supabaseNotConfigured'));
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        const msg = error.message.toLowerCase();
        if (msg.includes('fetch') || msg.includes('network') || msg.includes('failed to fetch')) {
          setErrorMsg(t('networkError'));
        } else {
          setErrorMsg(t('authError'));
        }
      } else {
        onLoginSuccess();
      }
    } catch (err: unknown) {
      const isNetwork = err instanceof Error && err.message.toLowerCase().includes('network');
      setErrorMsg(isNetwork ? t('networkError') : t('authError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-white/10 dark:bg-[#14171c]">
        <div className="text-center mb-6">
          <BrandLogo size={46} className="mx-auto mb-3" />
          <h1 className="luxury-serif text-2xl font-bold text-[#181512] dark:text-white">
            {t('adminLogin')}
          </h1>
        </div>

        {errorMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-500 dark:text-rose-400">
            <ShieldAlert size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1.5 text-xs font-semibold text-stone-700 dark:text-white/80">
              {t('email')}
            </label>
            <div className="relative">
              <input
                type="email"
                required
                dir="ltr"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@parfum.dz"
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 ps-10 text-sm text-[#181512] placeholder-stone-400 focus:border-[#b87a14] focus:outline-none dark:border-white/10 dark:bg-[#0b0d10] dark:text-white dark:placeholder-white/30 dark:focus:border-[#ffb442]"
              />
              <Mail size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-white/40" />
            </div>
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-stone-700 dark:text-white/80">
              {t('password')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                dir="ltr"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 ps-10 pe-10 text-sm text-[#181512] placeholder-stone-400 focus:border-[#b87a14] focus:outline-none dark:border-white/10 dark:bg-[#0b0d10] dark:text-white dark:placeholder-white/30 dark:focus:border-[#ffb442]"
              />
              <Lock size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-white/40" />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 dark:text-white/40 dark:hover:text-white transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#ffb442] py-3 text-sm font-bold text-[#241500] shadow-md shadow-[#ffb442]/20 hover:bg-[#ffc164] transition-all disabled:opacity-50"
          >
            {loading ? '...' : t('loginBtn')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-xs text-stone-500 hover:text-stone-900 transition-colors dark:text-white/50 dark:hover:text-white"
          >
            ← {t('viewStore')}
          </a>
        </div>
      </div>
    </div>
  );
}