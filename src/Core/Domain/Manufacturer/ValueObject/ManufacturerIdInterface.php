<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Domain\Manufacturer\ValueObject;

/**
 * This interface allows to explicitly define whether the manufacturer relation is optional or required.
 *
 * @see ManufacturerId
 * @see NoManufacturerId
 */
interface ManufacturerIdInterface
{
    /**
     * @return int
     */
    public function getValue();
}
