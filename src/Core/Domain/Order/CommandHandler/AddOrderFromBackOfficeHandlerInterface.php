<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Domain\Order\CommandHandler;

use PrestaShop\PrestaShop\Core\Domain\Order\Command\AddOrderFromBackOfficeCommand;
use PrestaShop\PrestaShop\Core\Domain\Order\ValueObject\OrderId;

/**
 * Interface for service that adds new order.
 */
interface AddOrderFromBackOfficeHandlerInterface
{
    /**
     * @param AddOrderFromBackOfficeCommand $command
     *
     * @return OrderId
     */
    public function handle(AddOrderFromBackOfficeCommand $command);
}
