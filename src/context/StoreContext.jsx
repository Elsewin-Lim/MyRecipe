import { useState, useCallback, useMemo, useRef } from 'react';
import { StoreContext } from './useStore';
import ToastViewport from '../components/Toast/ToastViewport';

export function AppProvider({ children }) {
  const [store, setStore] = useState({});
  const [toasts, setToasts] = useState([]);
  const nextToastIdRef = useRef(0);

  const setValue = useCallback((key, newValue) => {
    setStore((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  }, []);

  const removeValue = useCallback((key) => {
    setStore((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  }, []);

  const showToast = useCallback((message, options = {}) => {
    const id = options.id ?? `toast-${nextToastIdRef.current++}`;
    const toast = {
      id,
      message,
      type: options.type ?? 'info',
      duration: options.duration ?? 3000,
      dismissible: options.dismissible ?? true,
      className: options.className ?? '',
    };

    setToasts((previous) => {
      if (previous.some((item) => item.id === id)) {
        return previous.map((item) => (item.id === id ? toast : item));
      }

      return [...previous, toast].slice(-5);
    });

    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((previous) => previous.filter((item) => item.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      store,
      setValue,
      removeValue,
      showToast,
      dismissToast,
    }),
    [store, setValue, removeValue, showToast, dismissToast]
  );

  return (
    <StoreContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </StoreContext.Provider>
  );
}
