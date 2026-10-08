<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Domain\Employee\CommandHandler;

use PrestaShop\PrestaShop\Core\Domain\Employee\Command\SendEmployeePasswordResetEmailCommand;

interface SendEmployeePasswordResetEmailHandlerInterface
{
    /**
     * @param SendEmployeePasswordResetEmailCommand $command
     */
    public function handle(SendEmployeePasswordResetEmailCommand $command): void;
}
