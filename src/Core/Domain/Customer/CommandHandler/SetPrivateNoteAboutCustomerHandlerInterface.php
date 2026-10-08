<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Domain\Customer\CommandHandler;

use PrestaShop\PrestaShop\Core\Domain\Customer\Command\SetPrivateNoteAboutCustomerCommand;

/**
 * Defines interface for service that handles command which sets private note about customer
 */
interface SetPrivateNoteAboutCustomerHandlerInterface
{
    /**
     * @param SetPrivateNoteAboutCustomerCommand $command
     */
    public function handle(SetPrivateNoteAboutCustomerCommand $command);
}
