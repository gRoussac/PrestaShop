/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

import FormFieldToggle from './FormFieldToggle';
import ExportFormFieldToggle from './ExportFormFieldToggle';

export default class TranslationSettingsPage {
  constructor() {
    new FormFieldToggle();
    new ExportFormFieldToggle();
  }
}
