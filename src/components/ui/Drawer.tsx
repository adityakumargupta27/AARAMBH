import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: 'sm' | 'md' | 'lg';
}

export function Drawer({ open, onClose, title, subtitle, children, footer, width = 'md' }: DrawerProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleEsc);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleEsc);
      };
    }
  }, [open, onClose]);

  if (!open) return null;

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 z-50 animate-fade-in">
      <div className="absolute inset-0 bg-navy-950/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          'absolute right-0 top-0 bottom-0 bg-[#0f172a] border-l border-slate-700/40 shadow-2xl flex flex-col w-full animate-slide-in-right',
          widthClasses[width]
        )}
      >
        {(title || subtitle) && (
          <div className="flex items-start justify-between px-4 py-3.5 border-b border-slate-700/20">
            <div>
              {title && <h2 className="text-[15px] font-semibold text-white">{title}</h2>}
              {subtitle && <p className="text-[12px] text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-300 hover:bg-slate-800/30 rounded-md p-1 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4">{children}</div>
        {footer && <div className="px-4 py-3 border-t border-slate-700/20 flex items-center justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}
