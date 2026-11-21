export const DEFAULT_BOOK_PAGE_KEY = 'myrecipe:book-page';

export function readBookPage(key) {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;

    const value = JSON.parse(raw);

    if (
      !Number.isInteger(value?.page) ||
      !Number.isInteger(value?.total) ||
      value.page < 0 ||
      value.total <= 0
    ) {
      return null;
    }

    return { page: value.page, total: value.total };
  } catch {
    return null;
  }
}

export function writeBookPage(key, page, total) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(key, JSON.stringify({ page, total }));
  } catch {
    return;
  }
}

export function resolveStartPage(saved, contentPageCount) {
  const total = contentPageCount + 2;
  if (!saved) return 0;

  const page = Math.max(0, Math.min(saved.page, total - 1));

  if (saved.total === total) return page;

  return Math.min(page, contentPageCount);
}
