/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

import initDatePickers from '@app/utils/datepicker';

const {$} = window;

$(() => {
  initDatePickers();

  window.prestashop.component.initComponents(
    [
      'MultistoreConfigField',
      'TranslatableInput',
    ],
  );
});
