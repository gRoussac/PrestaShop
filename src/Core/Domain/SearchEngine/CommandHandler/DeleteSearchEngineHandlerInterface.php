<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Domain\SearchEngine\CommandHandler;

use PrestaShop\PrestaShop\Core\Domain\SearchEngine\Command\DeleteSearchEngineCommand;

/**
 * Defines contract for DeleteSearchEngineHandler.
 */
interface DeleteSearchEngineHandlerInterface
{
    /**
     * @param DeleteSearchEngineCommand $command
     */
    public function handle(DeleteSearchEngineCommand $command): void;
}
