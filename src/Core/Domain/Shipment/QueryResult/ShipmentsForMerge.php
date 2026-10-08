<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Domain\Shipment\QueryResult;

class ShipmentsForMerge
{
    public function __construct(
        private int $id,
        private string $shipmentName,
        private bool $canHandleProduct,
    ) {
    }

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * @return string
     */
    public function getShipmentName(): string
    {
        return $this->shipmentName;
    }

    /**
     * @return bool
     */
    public function getHandleProduct(): bool
    {
        return $this->canHandleProduct;
    }
}
