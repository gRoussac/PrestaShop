<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShop\PrestaShop\Core\Domain\Search\Exception;

use PrestaShop\PrestaShop\Core\Domain\Shop\ValueObject\ShopGroupId;
use Throwable;

class SearchIndexationShopGroupNotFoundException extends SearchIndexationInvalidContextException
{
    public ShopGroupId $shopGroupId;

    public function __construct(ShopGroupId $shopGroupId, string $message = '', int $code = 0, ?Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);

        $this->shopGroupId = $shopGroupId;
    }

    public function getShopGroupId(): ShopGroupId
    {
        return $this->shopGroupId;
    }
}
