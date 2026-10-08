<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace Tests\Integration\Behaviour\Features\Context;

use Cart;
use Context;

/**
 * aims to provide access to cart through contexts
 */
trait CartAwareTrait
{
    /**
     * @return Cart|null
     */
    public function getCurrentCart()
    {
        return Context::getContext()->cart;
    }
}
