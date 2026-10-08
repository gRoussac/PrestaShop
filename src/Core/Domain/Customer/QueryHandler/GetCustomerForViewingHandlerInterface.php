<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Domain\Customer\QueryHandler;

use PrestaShop\PrestaShop\Core\Domain\Customer\Query\GetCustomerForViewing;
use PrestaShop\PrestaShop\Core\Domain\Customer\QueryResult\ViewableCustomer;

/**
 * Class GetCustomerInformationHandlerInterface.
 */
interface GetCustomerForViewingHandlerInterface
{
    /**
     * @param GetCustomerForViewing $query
     *
     * @return ViewableCustomer
     */
    public function handle(GetCustomerForViewing $query);
}
