<?php

/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShop\PrestaShop\Core\Domain\Hook\QueryHandler;

use PrestaShop\PrestaShop\Core\Domain\Hook\Query\GetHook;

interface GetHookHandlerInterface
{
    public function handle(GetHook $query);
}
