<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Domain\Product\Shop\CommandHandler;

use PrestaShop\PrestaShop\Core\Domain\Product\Shop\Command\SetProductShopsCommand;

interface SetProductShopsHandlerInterface
{
    public function handle(SetProductShopsCommand $command): void;
}
