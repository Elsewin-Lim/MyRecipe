import { useCallback, useEffect, useRef, useState } from 'react';
import { TimerContext } from './timerContext';
import { useStore } from './useStore';
import {
  clearCookingTimerEnd,
  getCookingSession,
  setCookingTimerEnd,
} from '../data/cookingSession';

const ALERT_OGG = `${import.meta.env.BASE_URL}alert.ogg`;
const ALERT_WAV = `${import.meta.env.BASE_URL}alert.wav`;
const MAX_TIMEOUT = 2147483647;
const TICK_FREQUENCY = 880;
const TICK_VOLUME = 0.05;
const TICK_LENGTH = 0.05;

function secondsLeft(endsAt) {
  return Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
}

function readStoredTimer() {
  const endsAt = getCookingSession()?.timerEndsAt;

  if (!endsAt) return { endsAt: null, expired: false };
  if (endsAt > Date.now()) return { endsAt, expired: false };

  return { endsAt: null, expired: true };
}

export function TimerProvider({ children }) {
  const { showToast } = useStore();
  const [initialTimer] = useState(() => readStoredTimer());
  const [endsAt, setEndsAt] = useState(initialTimer.endsAt);
  const [remainingSeconds, setRemainingSeconds] = useState(
    initialTimer.endsAt ? secondsLeft(initialTimer.endsAt) : 0
  );
  const [hasFinished, setHasFinished] = useState(initialTimer.expired);
  const finishedRef = useRef(false);
  const expiredHandledRef = useRef(false);
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const lastTickRef = useRef(null);

  const getAlertAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio(ALERT_OGG);

      audio.preload = 'auto';
      audio.addEventListener(
        'error',
        () => {
          audio.src = ALERT_WAV;
        },
        { once: true }
      );
      audioRef.current = audio;
    }

    return audioRef.current;
  }, []);

  const playAlertSound = useCallback(() => {
    const audio = getAlertAudio();

    audio.muted = false;
    audio.currentTime = 0;

    const attempt = audio.play();
    if (attempt?.catch) attempt.catch(() => {});
  }, [getAlertAudio]);

  const primeAlertAudio = useCallback(() => {
    const audio = getAlertAudio();

    audio.muted = true;

    const attempt = audio.play();
    if (attempt?.then) {
      attempt
        .then(() => {
          audio.pause();
          audio.currentTime = 0;
          audio.muted = false;
        })
        .catch(() => {
          audio.muted = false;
        });
    } else {
      audio.muted = false;
    }
  }, [getAlertAudio]);

  const getAudioContext = useCallback(() => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return null;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextClass();
    }

    return audioContextRef.current;
  }, []);

  const playTick = useCallback(() => {
    const context = audioContextRef.current;
    if (!context || context.state !== 'running') return;

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(TICK_FREQUENCY, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(TICK_VOLUME, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + TICK_LENGTH);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + TICK_LENGTH + 0.01);
    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
    };
  }, []);

  const primeTickAudio = useCallback(() => {
    const context = getAudioContext();
    if (!context) return;

    if (context.state === 'suspended') {
      context
        .resume()
        .then(() => playTick())
        .catch(() => {});
      return;
    }

    playTick();
  }, [getAudioContext, playTick]);

  const showCompletionNotification = useCallback(() => {
    if (typeof Notification === 'undefined') return;
    if (!document.hidden) return;
    if (Notification.permission !== 'granted') return;

    try {
      new Notification('Cooking timer finished', {
        body: 'Your cooking timer is done.',
        tag: 'myrecipe-cooking-timer',
      });
    } catch {
      return;
    }
  }, []);

  const completeTimer = useCallback(() => {
    if (finishedRef.current) return;

    finishedRef.current = true;
    lastTickRef.current = null;
    setEndsAt(null);
    setRemainingSeconds(0);
    setHasFinished(true);
    clearCookingTimerEnd();
    playAlertSound();
    showCompletionNotification();
    showToast('Cooking timer finished', {
      id: 'cooking-timer-done',
      type: 'success',
    });
  }, [playAlertSound, showCompletionNotification, showToast]);

  useEffect(() => {
    if (endsAt == null) return undefined;

    function sync() {
      const remaining = secondsLeft(endsAt);

      setRemainingSeconds(remaining);

      if (remaining > 0 && remaining !== lastTickRef.current) {
        lastTickRef.current = remaining;
        playTick();
      }

      if (remaining === 0) completeTimer();
    }

    const interval = window.setInterval(sync, 250);
    const timeout = window.setTimeout(
      sync,
      Math.min(Math.max(0, endsAt - Date.now()), MAX_TIMEOUT)
    );

    function handleVisibilityChange() {
      if (!document.hidden) sync();
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', sync);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', sync);
    };
  }, [endsAt, completeTimer, playTick]);

  useEffect(() => {
    if (!initialTimer.expired || expiredHandledRef.current) return;

    expiredHandledRef.current = true;
    clearCookingTimerEnd();
    playAlertSound();
    showCompletionNotification();
    showToast('Cooking timer finished', {
      id: 'cooking-timer-done',
      type: 'success',
    });
  }, [
    initialTimer.expired,
    playAlertSound,
    showCompletionNotification,
    showToast,
  ]);

  function requestNotificationPermission() {
    if (typeof Notification === 'undefined') return;
    if (Notification.permission !== 'default') return;

    try {
      const attempt = Notification.requestPermission();
      if (attempt?.catch) attempt.catch(() => {});
    } catch {
      return;
    }
  }

  function startTimer(seconds) {
    const total = Math.max(0, Math.floor(Number(seconds) || 0));

    if (total <= 0) return false;

    const end = Date.now() + total * 1000;

    finishedRef.current = false;
    lastTickRef.current = total;
    setEndsAt(end);
    setRemainingSeconds(total);
    setHasFinished(false);
    setCookingTimerEnd(end);
    primeAlertAudio();
    primeTickAudio();
    requestNotificationPermission();

    return true;
  }

  function clearTimer() {
    finishedRef.current = false;
    lastTickRef.current = null;
    setEndsAt(null);
    setRemainingSeconds(0);
    setHasFinished(false);
    clearCookingTimerEnd();
  }

  const value = {
    endsAt,
    remainingSeconds,
    hasFinished,
    isRunning: endsAt != null,
    startTimer,
    clearTimer,
  };

  return (
    <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
  );
}
