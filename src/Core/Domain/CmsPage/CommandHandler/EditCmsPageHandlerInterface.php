<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Domain\CmsPage\CommandHandler;

use PrestaShop\PrestaShop\Core\Domain\CmsPage\Command\EditCmsPageCommand;

/**
 * Defines contract for EditCmsPageHandler.
 */
interface EditCmsPageHandlerInterface
{
    /**
     * @param EditCmsPageCommand $command
     */
    public function handle(EditCmsPageCommand $command);
}
