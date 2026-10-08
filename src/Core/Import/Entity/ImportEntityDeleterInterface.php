<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Import\Entity;

/**
 * Interface ImportEntityDeleterInterface describes an import entity deleter.
 */
interface ImportEntityDeleterInterface
{
    /**
     * Delete all import entity data for given import entity type.
     *
     * @param int $importEntity
     */
    public function deleteAll($importEntity);
}
