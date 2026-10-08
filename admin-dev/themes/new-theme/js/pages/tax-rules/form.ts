/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

import CountryStateSelector from './country-state-selector';

document.addEventListener('DOMContentLoaded', () => {
  try {
    new CountryStateSelector();
  } catch {
    // Form not present on page — nothing to initialize
  }
});
