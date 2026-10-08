<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShop\PrestaShop\Core\Domain\Shipment\CommandHandler;

use PrestaShop\PrestaShop\Core\Domain\Shipment\Command\AddProductToShipment;

interface AddProductToShipmentHandlerInterface
{
    public function handle(AddProductToShipment $command): void;
}
