<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Group\Provider;

/**
 * Interface for service that retrieves default customer group options
 */
interface DefaultGroupsProviderInterface
{
    /**
     * @return DefaultGroups
     */
    public function getGroups();
}
