<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Domain\Customer\CommandHandler;

use PrestaShop\PrestaShop\Core\Domain\Customer\Command\BulkDeleteCustomerCommand;

/**
 * Defines interface for customer bulk delete command handler.
 */
interface BulkDeleteCustomerHandlerInterface
{
    /**
     * @param BulkDeleteCustomerCommand $command
     */
    public function handle(BulkDeleteCustomerCommand $command);
}
