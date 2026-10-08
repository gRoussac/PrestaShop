/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

import FormSubmitButton from '@components/form-submit-button';
import TaxRulesManager from '@pages/tax-rules/tax-rules-manager';

document.addEventListener('DOMContentLoaded', () => {
  new FormSubmitButton();
  new TaxRulesManager();
});
