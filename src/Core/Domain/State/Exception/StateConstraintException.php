<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Domain\State\Exception;

/**
 * Is thrown when State constraint is violated
 */
class StateConstraintException extends StateException
{
    public const INVALID_ID = 1;
}
