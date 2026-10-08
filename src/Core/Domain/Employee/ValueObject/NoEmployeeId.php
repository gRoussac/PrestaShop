<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShop\PrestaShop\Core\Domain\Employee\ValueObject;

class NoEmployeeId implements EmployeeIdInterface
{
    /**
     * @var int
     */
    public const NO_EMPLOYEE_ID_VALUE = 0;

    public function getValue(): int
    {
        return self::NO_EMPLOYEE_ID_VALUE;
    }
}
