<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShop\PrestaShop\Core\Domain\Product\FeatureValue\Exception;

/**
 * Thrown when you try to associate the same value more than once.
 */
class DuplicateFeatureValueAssociationException extends ProductFeatureValueException
{
}
