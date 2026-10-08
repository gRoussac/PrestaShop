/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

import TableSorting from '@app/utils/table-sorting';

const {$} = window;

$(() => {
  new TableSorting($('table.table')).attach();
});
