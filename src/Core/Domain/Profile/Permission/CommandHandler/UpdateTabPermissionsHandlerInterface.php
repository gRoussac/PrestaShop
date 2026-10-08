<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Domain\Profile\Permission\CommandHandler;

use PrestaShop\PrestaShop\Core\Domain\Profile\Permission\Command\UpdateTabPermissionsCommand;

interface UpdateTabPermissionsHandlerInterface
{
    /**
     * @param UpdateTabPermissionsCommand $command
     */
    public function handle(UpdateTabPermissionsCommand $command): void;
}
