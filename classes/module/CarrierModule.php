<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */
abstract class CarrierModuleCore extends Module
{
    abstract public function getOrderShippingCost($params, $shipping_cost);

    abstract public function getOrderShippingCostExternal($params);

    /** @var int|null */
    public $id_carrier;
}
