<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Domain\Carrier;

interface CarrierLogoFileUploaderInterface
{
    /**
     * @param string $filePath
     * @param int $id
     */
    public function upload(string $filePath, int $id): void;

    public function deleteOldFile(int $id): void;
}
