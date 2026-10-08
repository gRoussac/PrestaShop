<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Domain\OrderMessage\CommandHandler;

use PrestaShop\PrestaShop\Core\Domain\OrderMessage\Command\BulkDeleteOrderMessageCommand;

/**
 * Interface for service that handles deleting of order messages
 */
interface BulkDeleteOrderMessageHandlerInterface
{
    /***
     * @param BulkDeleteOrderMessageCommand $command
     */
    public function handle(BulkDeleteOrderMessageCommand $command): void;
}
