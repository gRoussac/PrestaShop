<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Foundation\Templating;

interface PresenterInterface
{
    public function present($object); // must return an array
}
