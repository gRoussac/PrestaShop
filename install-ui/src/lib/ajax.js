/**
 * GET JSON from installer index.php.
 *
 * @param {Record<string, string|number|boolean>} params
 * @returns {Promise<{success: boolean, message?: string, warning?: string}>}
 */
export async function installGetJson(params) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    query.set(key, String(value));
  });
  const response = await fetch(`index.php?${query.toString()}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      `HTTP ${response.status}: expected JSON, got ${text.slice(0, 180)}`,
    );
  }
}
