const NEW_DRAFT_KEY = 'myrecipe:recipe-draft:new';
const EDIT_DRAFT_PREFIX = 'myrecipe:recipe-draft:edit:';

export function getRecipeDraftKey(editingRecipe) {
  return editingRecipe
    ? `${EDIT_DRAFT_PREFIX}${editingRecipe.id}`
    : NEW_DRAFT_KEY;
}

export function readRecipeDraft(key) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;

    const draft = JSON.parse(raw);
    if (!draft || typeof draft !== 'object') return null;

    return {
      title: typeof draft.title === 'string' ? draft.title : '',
      category:
        typeof draft.category === 'string' ? draft.category : 'Breakfast',
      ingredientRows: Array.isArray(draft.ingredientRows)
        ? draft.ingredientRows
        : null,
      instructionRows: Array.isArray(draft.instructionRows)
        ? draft.instructionRows
        : null,
      images: Array.isArray(draft.images)
        ? draft.images.filter((src) => typeof src === 'string')
        : [],
    };
  } catch {
    return null;
  }
}

function persistDraft(key, draft) {
  window.localStorage.setItem(key, JSON.stringify(draft));
}

export function writeRecipeDraft(key, draft) {
  try {
    persistDraft(key, draft);
  } catch {
    try {
      persistDraft(key, { ...draft, images: [] });
    } catch {
      return;
    }
  }
}

export function clearRecipeDraft(key) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    return;
  }
}
