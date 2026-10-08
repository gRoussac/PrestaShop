<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Domain\Currency\QueryHandler;

use PrestaShop\PrestaShop\Core\Domain\Currency\Query\GetCurrencyForEditing;

/**
 * Interface GetCurrencyForEditingHandlerInterface defines contract for GetCurrencyForFormEditingHandler.
 */
interface GetCurrencyForEditingHandlerInterface
{
    /**
     * @param GetCurrencyForEditing $query
     *
     * @return \PrestaShop\PrestaShop\Core\Domain\Currency\QueryResult\EditableCurrency
     */
    public function handle(GetCurrencyForEditing $query);
}
