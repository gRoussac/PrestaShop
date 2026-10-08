<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Search\Builder;

use PrestaShop\PrestaShop\Core\Data\AbstractTypedCollection;

/**
 * Collection of FiltersBuilderInterface.
 */
final class FiltersBuilderCollection extends AbstractTypedCollection
{
    /**
     * {@inheritdoc}
     */
    protected function getType()
    {
        return FiltersBuilderInterface::class;
    }
}
