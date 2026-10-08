<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Domain\State\CommandHandler;

use PrestaShop\PrestaShop\Core\Domain\State\Command\EditStateCommand;

interface EditStateHandlerInterface
{
    /**
     * @param EditStateCommand $command
     *
     * @return void
     */
    public function handle(EditStateCommand $command): void;
}
