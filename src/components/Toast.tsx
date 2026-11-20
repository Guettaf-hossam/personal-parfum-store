import { Check } from 'lucide-react';

interface ToastProps {
  message: string | null;
}

export function Toast({ message }: ToastProps) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 start-1/2 z-50 -translate-x-1/2 flex items-center gap-2 rounded-full border border-stone-300 bg-stone-900/95 px-5 py-2.5 text-xs font-semibold text-white shadow-2xl backdrop-blur-md animate-bounce dark:border-[#ffb442]/40 dark:bg-[#14171c]/95">
      <span className="flex size-5 items-center justify-center rounded-full bg-[#ffb442] text-[#241500]">
        <Check size={12} strokeWidth={3} />
      </span>
      <span>{message}</span>
    </div>
  );
}