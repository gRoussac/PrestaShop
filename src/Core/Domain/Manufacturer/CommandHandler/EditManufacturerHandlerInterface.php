<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Domain\Manufacturer\CommandHandler;

use PrestaShop\PrestaShop\Core\Domain\Manufacturer\Command\EditManufacturerCommand;

/**
 * Defines contract for EditManufacturerHandler
 */
interface EditManufacturerHandlerInterface
{
    /**
     * @param EditManufacturerCommand $command
     */
    public function handle(EditManufacturerCommand $command);
}
