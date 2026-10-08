<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Domain\Feature\Query;

use PrestaShop\PrestaShop\Core\Domain\Feature\ValueObject\FeatureId;

/**
 * Retrieves feature data for editing
 */
class GetFeatureForEditing
{
    /**
     * @var FeatureId
     */
    private $featureId;

    /**
     * @param int $featureId
     */
    public function __construct($featureId)
    {
        $this->featureId = new FeatureId($featureId);
    }

    /**
     * @return FeatureId
     */
    public function getFeatureId()
    {
        return $this->featureId;
    }
}
