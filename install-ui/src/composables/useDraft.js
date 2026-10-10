/**
 * localStorage draft helpers (never store passwords).
 */

export function loadDraft(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '{}') || {};
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
    localStorage.setItem(key, JSON.stringify(draft));
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
