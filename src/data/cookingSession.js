const COOKING_SESSION_KEY = 'myrecipe:cooking-recipe-id';

function saveCookingSession(session) {
  try {
    window.sessionStorage.setItem(COOKING_SESSION_KEY, JSON.stringify(session));
  } catch {
    return;
  }
}

function normalizeTimerEnd(value) {
  const endsAt = Number(value);
  return Number.isFinite(endsAt) && endsAt > 0 ? endsAt : null;
}

export function startCookingSession(recipeId) {
  saveCookingSession({ recipeId: String(recipeId), stepIndex: 0 });
}

export function updateCookingStep(recipeId, stepIndex) {
  saveCookingSession({
    recipeId: String(recipeId),
    stepIndex: Math.max(0, Math.floor(Number(stepIndex) || 0)),
  });
}

export function setCookingTimerEnd(endsAt) {
  const session = getCookingSession();
  if (!session?.recipeId) return;

  saveCookingSession({
    recipeId: session.recipeId,
    stepIndex: session.stepIndex,
    timerEndsAt: Math.max(0, Math.floor(Number(endsAt) || 0)),
  });
}

export function clearCookingTimerEnd() {
  const session = getCookingSession();
  if (!session?.recipeId) return;

  saveCookingSession({
    recipeId: session.recipeId,
    stepIndex: session.stepIndex,
  });
}

export function getCookingSession() {
  try {
    const raw = window.sessionStorage.getItem(COOKING_SESSION_KEY);
    if (!raw) return null;

    try {
      const session = JSON.parse(raw);

      if (session && typeof session === 'object') {
        return {
          recipeId: session.recipeId != null ? String(session.recipeId) : null,
          stepIndex: Math.max(0, Math.floor(Number(session.stepIndex) || 0)),
          timerEndsAt: normalizeTimerEnd(session.timerEndsAt),
        };
      }
    } catch {
      return { recipeId: raw, stepIndex: 0, timerEndsAt: null };
    }

    return { recipeId: raw, stepIndex: 0, timerEndsAt: null };
  } catch {
    return null;
  }
}

export function clearCookingSession() {
  try {
    window.sessionStorage.removeItem(COOKING_SESSION_KEY);
  } catch {
    return;
  }
}
