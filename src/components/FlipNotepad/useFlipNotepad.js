import { useCallback, useEffect, useRef, useState } from 'react';
import { createFlipElement, spinFlip } from './flipNotepadAnimation';
import { dateKey, readNote, startOfDay, writeNote } from './flipNotepadStorage';

const PREFIX = 'notepad:';

export function useFlipNotepad({ initialDate, storagePrefix = PREFIX } = {}) {
  const [current, setCurrent] = useState(() => startOfDay(initialDate));
  const [draft, setDraft] = useState(() => readNote(current, storagePrefix));

  const stageRef = useRef(null);
  const textareaRef = useRef(null);
  const busyRef = useRef(false);
  const mountedRef = useRef(false);
  const currentRef = useRef(current);
  const flipsRef = useRef(new Set());

  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  const show = useCallback(
    (date) => {
      currentRef.current = date;
      setCurrent(date);
      setDraft(readNote(date, storagePrefix));
    },
    [storagePrefix]
  );

  const go = useCallback(
    (date, instant = false) => {
      const next = startOfDay(date);

      if (busyRef.current || dateKey(next) === dateKey(currentRef.current)) {
        return;
      }

      const forward = next > currentRef.current;
      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
      const stage = stageRef.current;

      if (instant || reduceMotion || !stage) {
        show(next);
        return;
      }

      busyRef.current = true;

      if (forward) {
        const flip = createFlipElement(
          stage,
          currentRef.current,
          textareaRef.current?.value ??
            readNote(currentRef.current, storagePrefix)
        );

        flipsRef.current.add(flip);
        show(next);

        spinFlip(flip, true).onfinish = () => {
          flipsRef.current.delete(flip);
          flip.remove();
          busyRef.current = false;

          if (mountedRef.current) {
            textareaRef.current?.focus({ preventScroll: true });
          }
        };

        return;
      }

      const flip = createFlipElement(
        stage,
        next,
        readNote(next, storagePrefix)
      );

      flipsRef.current.add(flip);

      spinFlip(flip, false).onfinish = () => {
        flipsRef.current.delete(flip);
        flip.remove();
        busyRef.current = false;

        if (!mountedRef.current) return;

        show(next);
        textareaRef.current?.focus({ preventScroll: true });
      };
    },
    [show, storagePrefix]
  );

  const step = useCallback(
    (amount) => {
      const date = currentRef.current;

      go(
        new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount)
      );
    },
    [go]
  );

  const goToDate = useCallback((date) => go(date), [go]);

  const goToToday = useCallback(() => go(new Date()), [go]);

  const handleInput = useCallback(
    (event) => {
      const value = event.target.value;
      setDraft(value);
      writeNote(currentRef.current, value, storagePrefix);
    },
    [storagePrefix]
  );

  useEffect(() => {
    mountedRef.current = true;
    const flips = flipsRef.current;

    return () => {
      mountedRef.current = false;

      flips.forEach((flip) => {
        flip.getAnimations?.().forEach((animation) => animation.cancel());
        flip.remove();
      });

      flips.clear();
      busyRef.current = false;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey && event.key === 'ArrowLeft') {
        event.preventDefault();
        step(-1);
      }

      if (event.altKey && event.key === 'ArrowRight') {
        event.preventDefault();
        step(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step]);

  return {
    current,
    draft,
    stageRef,
    textareaRef,
    goToDate,
    goToToday,
    step,
    handleInput,
  };
}
