<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Domain\Cart\CommandHandler;

use PrestaShop\PrestaShop\Core\Domain\Cart\Command\UpdateCartCurrencyCommand;

/**
 * Interface for service that handles cart currency updating
 */
interface UpdateCartCurrencyHandlerInterface
{
    /**
     * @param UpdateCartCurrencyCommand $command
     */
    public function handle(UpdateCartCurrencyCommand $command): void;
}
