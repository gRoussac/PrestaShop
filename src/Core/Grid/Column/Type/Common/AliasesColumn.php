<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Grid\Column\Type\Common;

use PrestaShop\PrestaShop\Core\Grid\Column\AbstractColumn;

final class AliasesColumn extends AbstractColumn
{
    /**
     * {@inheritdoc}
     */
    public function getType()
    {
        return 'aliases';
    }
}
