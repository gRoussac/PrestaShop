/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

import CustomerForm from './CustomerForm';

$(() => {
  new CustomerForm();

  window.prestashop.component.initComponents(
    [
      'ChoiceTable',
    ],
  );
});
