<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Domain\Cart\CommandHandler;

use PrestaShop\PrestaShop\Core\Domain\Cart\Command\AddProductToCartCommand;

/**
 * Interface for handling addProductToCart command
 */
interface AddProductToCartHandlerInterface
{
    /**
     * @param AddProductToCartCommand $command
     */
    public function handle(AddProductToCartCommand $command): void;
}
