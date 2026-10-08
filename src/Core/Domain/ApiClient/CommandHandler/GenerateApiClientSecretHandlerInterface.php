<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShop\PrestaShop\Core\Domain\ApiClient\CommandHandler;

use PrestaShop\PrestaShop\Core\Domain\ApiClient\Command\GenerateApiClientSecretCommand;

interface GenerateApiClientSecretHandlerInterface
{
    public function handle(GenerateApiClientSecretCommand $command): string;
}
