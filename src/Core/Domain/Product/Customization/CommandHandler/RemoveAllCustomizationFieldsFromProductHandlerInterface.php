<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShop\PrestaShop\Core\Domain\Product\Customization\CommandHandler;

use PrestaShop\PrestaShop\Core\Domain\Product\Customization\Command\RemoveAllCustomizationFieldsFromProductCommand;

/**
 * Defines contract to handle @see RemoveAllCustomizationFieldsFromProductCommand
 */
interface RemoveAllCustomizationFieldsFromProductHandlerInterface
{
    /**
     * @param RemoveAllCustomizationFieldsFromProductCommand $command
     */
    public function handle(RemoveAllCustomizationFieldsFromProductCommand $command): void;
}
