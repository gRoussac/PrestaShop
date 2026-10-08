<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Domain\Cart\CommandHandler;

use PrestaShop\PrestaShop\Core\Domain\Cart\Command\RemoveProductFromCartCommand;

/**
 * Interface for service that handles product removing from cart.
 */
interface RemoveProductFromCartHandlerInterface
{
    /**
     * @param RemoveProductFromCartCommand $command
     */
    public function handle(RemoveProductFromCartCommand $command);
}
