<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Domain\Employee\CommandHandler;

use PrestaShop\PrestaShop\Core\Domain\Employee\Command\DeleteEmployeeCommand;

/**
 * Interface DeleteEmployeeHandlerInterface.
 */
interface DeleteEmployeeHandlerInterface
{
    /**
     * @param DeleteEmployeeCommand $command
     */
    public function handle(DeleteEmployeeCommand $command);
}
