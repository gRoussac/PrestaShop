<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Tax\Ecotax;

/**
 * Resets Ecotax for products
 */
interface ProductEcotaxResetterInterface
{
    /**
     * Resets ecotax for all products
     */
    public function reset();
}
