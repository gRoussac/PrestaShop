<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Domain\Theme\CommandHandler;

use PrestaShop\PrestaShop\Core\Domain\Theme\Command\EnableThemeCommand;

/**
 * Interface EnableThemeHandlerInterface
 */
interface EnableThemeHandlerInterface
{
    /**
     * @param EnableThemeCommand $command
     */
    public function handle(EnableThemeCommand $command);
}
