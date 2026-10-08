<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Domain\Customer\QueryHandler;

use PrestaShop\PrestaShop\Core\Domain\Customer\Query\GetCustomerForEditing;
use PrestaShop\PrestaShop\Core\Domain\Customer\QueryResult\EditableCustomer;

/**
 * Interface for service that gets customer data for editing
 */
interface GetCustomerForEditingHandlerInterface
{
    /**
     * @param GetCustomerForEditing $query
     *
     * @return EditableCustomer
     */
    public function handle(GetCustomerForEditing $query);
}
