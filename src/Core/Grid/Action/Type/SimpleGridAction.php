<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Grid\Action\Type;

use PrestaShop\PrestaShop\Core\Grid\Action\AbstractGridAction;

final class SimpleGridAction extends AbstractGridAction
{
    /**
     * {@inheritdoc}
     */
    public function getType()
    {
        return 'simple';
    }
}
