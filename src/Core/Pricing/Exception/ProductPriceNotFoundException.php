<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShop\PrestaShop\Core\Pricing\Exception;

/**
 * Thrown when no pricing data can be found for a given product (or combination).
 */
class ProductPriceNotFoundException extends PricingException
{
}
