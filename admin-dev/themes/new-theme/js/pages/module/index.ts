/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

import ModuleCard from '@components/module-card';
import AdminModuleController from '@pages/module/controller';
import ModuleLoader from '@pages/module/loader';

const {$} = window;

$(() => {
  const moduleCardController = new ModuleCard();
  new ModuleLoader();
  new AdminModuleController(moduleCardController);
});
