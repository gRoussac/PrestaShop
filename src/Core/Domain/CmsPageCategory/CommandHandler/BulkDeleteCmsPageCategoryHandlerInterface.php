<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Domain\CmsPageCategory\CommandHandler;

use PrestaShop\PrestaShop\Core\Domain\CmsPageCategory\Command\BulkDeleteCmsPageCategoryCommand;

/**
 * Interface BulkDeleteCmsPageCategoryHandlerInterface defines contract for BulkDeleteCmsPageCategoryHandler.
 */
interface BulkDeleteCmsPageCategoryHandlerInterface
{
    /**
     * @param BulkDeleteCmsPageCategoryCommand $command
     */
    public function handle(BulkDeleteCmsPageCategoryCommand $command);
}
