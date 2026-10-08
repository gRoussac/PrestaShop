<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Foundation\Database;

interface DatabaseInterface
{
    public function select($sqlString);

    public function escape($unsafeData);
}
