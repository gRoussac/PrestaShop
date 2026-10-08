<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Domain\Cart\QueryHandler;

use PrestaShop\PrestaShop\Core\Domain\Cart\Query\GetCartForOrderCreation;
use PrestaShop\PrestaShop\Core\Domain\Cart\QueryResult\CartForOrderCreation;

/**
 * Interface for handling GetCartForOrderCreation query
 */
interface GetCartForOrderCreationHandlerInterface
{
    public function handle(GetCartForOrderCreation $query): CartForOrderCreation;
}
