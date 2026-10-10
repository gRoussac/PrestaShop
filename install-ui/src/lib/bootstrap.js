/**
 * @returns {import('../types/bootstrap').InstallBootstrap}
 */
export function getBootstrap() {
  return window.__INSTALL_BOOTSTRAP__ || { step: 'welcome', strings: {}, stepData: {} };
}

/**
 * @param {string} key
 * @param {Record<string, string|number>} [replacements]
 */
export function t(key, replacements = {}) {
  const strings = getBootstrap().strings || {};
  let value = strings[key] ?? key;
  Object.entries(replacements).forEach(([token, replacement]) => {
    value = value.split(token).join(String(replacement));
  });
  return value;
}
