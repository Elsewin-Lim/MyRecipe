import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Toast from './Toast';

export default function ToastViewport({ toasts, onDismiss }) {
  useEffect(() => {
    const updateOffset = () => {
      const nav = document.querySelector('.HomeNav');
      const navHeight = nav?.getBoundingClientRect().height ?? 0;

      document.documentElement.style.setProperty(
        '--toast-top',
        `${navHeight + 16}px`
      );
    };

    updateOffset();

    const nav = document.querySelector('.HomeNav');
    const observer =
      typeof ResizeObserver !== 'undefined' && nav
        ? new ResizeObserver(updateOffset)
        : null;

    observer?.observe(nav);
    window.addEventListener('resize', updateOffset);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', updateOffset);
      document.documentElement.style.removeProperty('--toast-top');
    };
  }, []);

  if (typeof document === 'undefined' || toasts.length === 0) return null;

  return createPortal(
    <div className="ToastViewport" role="region" aria-label="Notifications">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          dismissible={toast.dismissible}
          className={toast.className}
          onClose={() => onDismiss(toast.id)}
        />
      ))}
    </div>,
    document.body
  );
}
