<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Domain\ImageSettings\CommandHandler;

use PrestaShop\PrestaShop\Core\Domain\ImageSettings\Command\EditImageTypeCommand;

/**
 * Defines contract for EditImageTypeHandler
 */
interface EditImageTypeHandlerInterface
{
    /**
     * @param EditImageTypeCommand $command
     */
    public function handle(EditImageTypeCommand $command): void;
}
