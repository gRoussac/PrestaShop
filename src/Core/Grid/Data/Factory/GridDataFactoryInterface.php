<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Grid\Data\Factory;

use PrestaShop\PrestaShop\Core\Grid\Data\GridData;
use PrestaShop\PrestaShop\Core\Grid\Search\SearchCriteriaInterface;

/**
 * Interface GridDataFactoryInterface defines contract for grid data factories.
 */
interface GridDataFactoryInterface
{
    /**
     * @param SearchCriteriaInterface $searchCriteria
     *
     * @return GridData
     */
    public function getData(SearchCriteriaInterface $searchCriteria);
}
