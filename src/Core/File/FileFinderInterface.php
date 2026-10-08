<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\File;

/**
 * Interface FileFinderInterface defines a file finder.
 */
interface FileFinderInterface
{
    /**
     * Finds files.
     *
     * @return array of file paths
     */
    public function find();
}
