import { createContext, useContext } from 'react';

export const TimerContext = createContext(null);

export function useTimer() {
  const context = useContext(TimerContext);

  if (!context) {
    throw new Error('useTimer must be used inside TimerProvider');
  }

  return context;
}
