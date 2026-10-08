<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Domain\AttributeGroup\Attribute\CommandHandler;

use PrestaShop\PrestaShop\Core\Domain\AttributeGroup\Attribute\Command\DeleteAttributeCommand;

/**
 * Interface for handling command which deletes Attribute
 */
interface DeleteAttributeHandlerInterface
{
    /**
     * @param DeleteAttributeCommand $command
     */
    public function handle(DeleteAttributeCommand $command);
}
