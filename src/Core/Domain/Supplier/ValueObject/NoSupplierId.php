<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShop\PrestaShop\Core\Domain\Supplier\ValueObject;

class NoSupplierId implements SupplierIdInterface
{
    public const NO_SUPPLIER_ID = 0;

    public function getValue(): int
    {
        return static::NO_SUPPLIER_ID;
    }
}
