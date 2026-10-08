<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Domain\ImageSettings\CommandHandler;

use PrestaShop\PrestaShop\Core\Domain\ImageSettings\Command\RegenerateThumbnailsCommand;

/**
 * Defines contract for RegenerateThumbnailsHandler
 */
interface RegenerateThumbnailsHandlerInterface
{
    /**
     * @param RegenerateThumbnailsCommand $command
     */
    public function handle(RegenerateThumbnailsCommand $command): void;
}
