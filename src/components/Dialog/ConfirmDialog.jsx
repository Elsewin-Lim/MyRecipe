import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import './ConfirmDialog.css';

export default function ConfirmDialog({
  open,
  title = 'Confirm action',
  message = 'Are you sure?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  onConfirm,
  onCancel,
}) {
  const titleId = useId();
  const messageId = useId();
  const cancelRef = useRef(null);
  const confirmRef = useRef(null);
  const onConfirmRef = useRef(onConfirm);
  const onCancelRef = useRef(onCancel);

  useEffect(() => {
    onConfirmRef.current = onConfirm;
    onCancelRef.current = onCancel;
  });

  useEffect(() => {
    if (!open) return undefined;

    const previousFocus = document.activeElement;
    const timer = window.setTimeout(() => cancelRef.current?.focus(), 0);

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCancelRef.current?.();
        return;
      }

      if (event.key !== 'Tab') return;

      const first = cancelRef.current;
      const last = confirmRef.current;
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [open]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="DialogOverlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancelRef.current?.();
      }}
    >
      <div
        className="Dialog"
        role={danger ? 'alertdialog' : 'dialog'}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={messageId}
      >
        <h2 id={titleId} className="Dialog__title">
          {title}
        </h2>
        <p id={messageId} className="Dialog__message">
          {message}
        </p>

        <div className="Dialog__actions">
          <button
            ref={cancelRef}
            type="button"
            className="Dialog__button"
            onClick={() => onCancelRef.current?.()}
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            className={`Dialog__button Dialog__button--primary${
              danger ? ' Dialog__button--danger' : ''
            }`}
            onClick={() => onConfirmRef.current?.()}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
