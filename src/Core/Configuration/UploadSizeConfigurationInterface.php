<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Configuration;

interface UploadSizeConfigurationInterface
{
    /**
     * @return int
     */
    public function getMaxUploadSizeInBytes(): int;

    /**
     * @return int
     */
    public function getPostMaxSizeInBytes(): int;
}
