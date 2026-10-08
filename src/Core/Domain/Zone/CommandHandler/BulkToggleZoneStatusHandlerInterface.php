<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Domain\Zone\CommandHandler;

use PrestaShop\PrestaShop\Core\Domain\Zone\Command\BulkToggleZoneStatusCommand;

/**
 * Defines contract for BulkToggleZoneStatusHandler
 */
interface BulkToggleZoneStatusHandlerInterface
{
    /**
     * @param BulkToggleZoneStatusCommand $command
     */
    public function handle(BulkToggleZoneStatusCommand $command): void;
}
