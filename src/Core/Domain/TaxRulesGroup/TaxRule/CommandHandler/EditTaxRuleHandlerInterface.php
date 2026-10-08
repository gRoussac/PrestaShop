<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShop\PrestaShop\Core\Domain\TaxRulesGroup\TaxRule\CommandHandler;

use PrestaShop\PrestaShop\Core\Domain\TaxRulesGroup\TaxRule\Command\EditTaxRuleCommand;

/**
 * Defines contract for editing a tax rule
 */
interface EditTaxRuleHandlerInterface
{
    /**
     * @param EditTaxRuleCommand $command
     */
    public function handle(EditTaxRuleCommand $command): void;
}
