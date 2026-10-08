<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Adapter\Order;

use OrderInvoice as InvoiceLegacy;
use PrestaShop\PrestaShop\Core\Order\InvoiceInterface;

/**
 * Invoice Helper.
 */
final class Invoice implements InvoiceInterface
{
    /**
     * {@inheritdoc}
     */
    public static function getByDeliveryDateInterval($dateFrom, $dateTo)
    {
        return InvoiceLegacy::getByDeliveryDateInterval($dateFrom, $dateTo);
    }
}
