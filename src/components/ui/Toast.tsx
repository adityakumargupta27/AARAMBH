import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { cn } from '@/utils/cn';

type ToastType = 'success' | 'warning' | 'info' | 'error';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextValue {
  toast: (type: ToastType, title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((type: ToastType, title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => remove(id), 4000);
  }, [remove]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[60] space-y-2 w-80">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const configs = {
    success: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
    warning: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/30' },
    info: { icon: Info, color: 'text-sky-400', bg: 'bg-sky-500/15', border: 'border-sky-500/30' },
    error: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' },
  };
  const config = configs[toast.type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3 rounded-lg border shadow-xl bg-slate-900/90 backdrop-blur-md animate-slide-in-right',
        config.border
      )}
    >
      <div className={cn('flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center', config.bg)}>
        <Icon className={cn('w-4 h-4', config.color)} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-white">{toast.title}</p>
        {toast.description && <p className="text-[12px] text-slate-400 mt-0.5">{toast.description}</p>}
      </div>
      <button onClick={onClose} className="text-slate-400 hover:text-slate-200 flex-shrink-0">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
