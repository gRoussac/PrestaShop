<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShopBundle\Entity\Enum;

enum AddressTypeEnum: string
{
    case BOTH = 'both';
    case INVOICE = 'invoice';
    case DELIVERY = 'delivery';
}
