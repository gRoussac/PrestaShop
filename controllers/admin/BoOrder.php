<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */
class BoOrderCore extends PaymentModule
{
    /** @var bool */
    public $active = true;
    /** @var string */
    public $name = 'bo_order';

    public function __construct()
    {
        $this->displayName = $this->trans('Back office order', [], 'Admin.Orderscustomers.Feature');
    }
}
