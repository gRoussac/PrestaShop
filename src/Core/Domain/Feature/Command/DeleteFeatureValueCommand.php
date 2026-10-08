<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */
declare(strict_types=1);

namespace PrestaShop\PrestaShop\Core\Domain\Feature\Command;

use PrestaShop\PrestaShop\Core\Domain\Feature\ValueObject\FeatureValueId;

class DeleteFeatureValueCommand
{
    private readonly FeatureValueId $featureValueId;

    public function __construct(
        int $featureValueId
    ) {
        $this->featureValueId = new FeatureValueId($featureValueId);
    }

    /**
     * @return FeatureValueId
     */
    public function getFeatureValueId(): FeatureValueId
    {
        return $this->featureValueId;
    }
}
