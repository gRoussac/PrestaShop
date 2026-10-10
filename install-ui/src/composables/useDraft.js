/**
 * sessionStorage draft helpers (never store passwords).
 * Session-scoped only: cleared when the browser tab/session ends.
 */

export function loadDraft(key) {
  try {
    return JSON.parse(sessionStorage.getItem(key) || '{}') || {};
  } catch {
    return {};
  }
}

export function saveDraft(key, partial, omitKeys = []) {
  try {
    const draft = { ...loadDraft(key), ...partial };
    omitKeys.forEach((omitKey) => {
      delete draft[omitKey];
    });
    sessionStorage.setItem(key, JSON.stringify(draft));
  } catch {
    // Ignore quota / private mode.
  }
}

export function isBlankInstallValue(value) {
  return (
    value === null ||
    value === undefined ||
    String(value).trim() === '' ||
    value === '0'
  );
}
