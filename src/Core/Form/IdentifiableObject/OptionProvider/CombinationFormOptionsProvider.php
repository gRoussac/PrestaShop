<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShop\PrestaShop\Core\Form\IdentifiableObject\OptionProvider;

class CombinationFormOptionsProvider implements FormOptionsProviderInterface
{
    /**
     * {@inheritDoc}
     */
    public function getOptions(int $id, array $data): array
    {
        return [
            'product_id' => $data['product_id'] ?? null,
        ];
    }

    /**
     * {@inheritDoc}
     */
    public function getDefaultOptions(array $data): array
    {
        return [];
    }
}
