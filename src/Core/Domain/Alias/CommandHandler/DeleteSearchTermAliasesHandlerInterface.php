<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Domain\Alias\CommandHandler;

use PrestaShop\PrestaShop\Core\Domain\Alias\Command\DeleteSearchTermAliasesCommand;

/**
 * Defines contract to handle @see DeleteSearchTermAliasesCommand
 */
interface DeleteSearchTermAliasesHandlerInterface
{
    /**
     * @param DeleteSearchTermAliasesCommand $command
     */
    public function handle(DeleteSearchTermAliasesCommand $command): void;
}
