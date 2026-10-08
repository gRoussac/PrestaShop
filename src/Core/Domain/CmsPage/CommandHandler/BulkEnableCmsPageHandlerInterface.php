<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Domain\CmsPage\CommandHandler;

use PrestaShop\PrestaShop\Core\Domain\CmsPage\Command\BulkEnableCmsPageCommand;

/**
 * Defines contract for BulkEnableCmsPageHandler.
 */
interface BulkEnableCmsPageHandlerInterface
{
    /**
     * @param BulkEnableCmsPageCommand $command
     */
    public function handle(BulkEnableCmsPageCommand $command);
}
