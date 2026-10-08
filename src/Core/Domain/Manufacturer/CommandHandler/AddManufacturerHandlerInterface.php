<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Domain\Manufacturer\CommandHandler;

use PrestaShop\PrestaShop\Core\Domain\Manufacturer\Command\AddManufacturerCommand;
use PrestaShop\PrestaShop\Core\Domain\Manufacturer\ValueObject\ManufacturerId;

/**
 * Defines contract for AddManufacturerHandler
 */
interface AddManufacturerHandlerInterface
{
    /**
     * @param AddManufacturerCommand $command
     *
     * @return ManufacturerId
     */
    public function handle(AddManufacturerCommand $command);
}
