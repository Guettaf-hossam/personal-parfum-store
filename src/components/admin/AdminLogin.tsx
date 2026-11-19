import { Lock, Mail, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { supabase } from '../../lib/supabase';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        onLoginSuccess();
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#14171c] p-6 sm:p-8 shadow-2xl dark:bg-[#14171c] not-dark:bg-white not-dark:border-slate-200">
        <div className="text-center mb-6">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#ffb442] text-[#241500] font-bold shadow-lg shadow-[#ffb442]/20 mb-3">
            <Lock size={22} />
          </div>
          <h1 className="luxury-serif text-2xl font-bold text-white dark:text-white not-dark:text-slate-900">
            {t('adminLogin')}
          </h1>
        </div>

        {errorMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
            <ShieldAlert size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1.5 text-xs font-semibold text-white/80 dark:text-white/80 not-dark:text-slate-700">
              {t('email')}
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@parfum.dz"
                className="w-full rounded-xl border border-white/10 bg-[#0b0d10] px-3.5 py-2.5 ps-10 text-sm text-white placeholder-white/30 focus:border-[#ffb442] focus:outline-none dark:bg-[#0b0d10] dark:text-white not-dark:bg-slate-100 not-dark:text-slate-900 not-dark:placeholder-slate-400 not-dark:border-slate-300"
              />
              <Mail size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-white/40 not-dark:text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-white/80 dark:text-white/80 not-dark:text-slate-700">
              {t('password')}
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-[#0b0d10] px-3.5 py-2.5 ps-10 text-sm text-white placeholder-white/30 focus:border-[#ffb442] focus:outline-none dark:bg-[#0b0d10] dark:text-white not-dark:bg-slate-100 not-dark:text-slate-900 not-dark:placeholder-slate-400 not-dark:border-slate-300"
              />
              <Lock size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-white/40 not-dark:text-slate-400" />
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
            className="text-xs text-white/50 hover:text-white transition-colors dark:text-white/50 not-dark:text-slate-500"
          >
            ← {t('viewStore')}
          </a>
        </div>
      </div>
    </div>
  );
}
