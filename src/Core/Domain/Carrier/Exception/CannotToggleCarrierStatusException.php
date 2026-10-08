<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShop\PrestaShop\Core\Domain\Carrier\Exception;

/**
 * Thrown when cannot toggle carrier status
 */
class CannotToggleCarrierStatusException extends CarrierException
{
    /**
     * Thrown when cannot toggle single carrier status.
     */
    public const SINGLE_TOGGLE = 10;

    /**
     * Thrown when cannot bulk toggle carrier status.
     */
    public const BULK_TOGGLE = 20;
}
