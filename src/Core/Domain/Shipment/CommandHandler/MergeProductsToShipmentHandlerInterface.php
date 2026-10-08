<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Domain\Shipment\CommandHandler;

use PrestaShop\PrestaShop\Core\Domain\Shipment\Command\MergeProductsToShipment;

interface MergeProductsToShipmentHandlerInterface
{
    /**
     * @param MergeProductsToShipment $command
     */
    public function handle(MergeProductsToShipment $command);
}
