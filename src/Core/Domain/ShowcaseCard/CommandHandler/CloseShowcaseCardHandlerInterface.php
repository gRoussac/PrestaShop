<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Domain\ShowcaseCard\CommandHandler;

use PrestaShop\PrestaShop\Core\Domain\ShowcaseCard\Command\CloseShowcaseCardCommand;

/**
 * Contract for handling CloseShowcaseCardCommand
 */
interface CloseShowcaseCardHandlerInterface
{
    /**
     * Closes a showcase card permanently
     *
     * @param CloseShowcaseCardCommand $command
     */
    public function handle(CloseShowcaseCardCommand $command);
}
