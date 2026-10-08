<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Domain\Order\QueryHandler;

use PrestaShop\PrestaShop\Core\Domain\Order\Query\GetOrderProductsForViewing;
use PrestaShop\PrestaShop\Core\Domain\Order\QueryResult\OrderProductsForViewing;

/**
 * Defines contract for GetOrderProductsForViewing query handler
 */
interface GetOrderProductsForViewingHandlerInterface
{
    /**
     * @param GetOrderProductsForViewing $query
     *
     * @return OrderProductsForViewing
     */
    public function handle(GetOrderProductsForViewing $query);
}
