<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Domain\OrderReturn\QueryHandler;

use PrestaShop\PrestaShop\Core\Domain\OrderReturn\Query\GetOrderReturnForEditing;
use PrestaShop\PrestaShop\Core\Domain\OrderReturn\QueryResult\OrderReturnForEditing;

/**
 * Defines contract for GetOrderReturnForEditingHandler
 */
interface GetOrderReturnForEditingHandlerInterface
{
    /**
     * @param GetOrderReturnForEditing $query
     *
     * @return OrderReturnForEditing
     */
    public function handle(GetOrderReturnForEditing $query): OrderReturnForEditing;
}
