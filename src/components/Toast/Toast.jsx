import { useEffect, useRef, useState } from 'react';
import './Toast.css';

const TYPES = ['info', 'success', 'warning', 'error'];

export default function Toast({
  message,
  type = 'info',
  duration = 3000,
  dismissible = true,
  className = '',
  onClose,
}) {
  const [paused, setPaused] = useState(false);
  const onCloseRef = useRef(onClose);
  const safeType = TYPES.includes(type) ? type : 'info';

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!duration || paused) return undefined;

    const timer = window.setTimeout(() => onCloseRef.current?.(), duration);
    return () => window.clearTimeout(timer);
  }, [duration, paused, message]);

  const classes = ['Toast', safeType, className].filter(Boolean).join(' ');
  const isError = safeType === 'error';

  return (
    <div
      className={classes}
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
      aria-atomic="true"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <span className="Toast__message">{message}</span>

      {dismissible && (
        <button
          type="button"
          className="Toast__close"
          onClick={() => onCloseRef.current?.()}
          aria-label="Dismiss notification"
        >
          ×
        </button>
      )}
    </div>
  );
}
