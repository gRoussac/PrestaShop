<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Domain\TaxRulesGroup\CommandHandler;

use PrestaShop\PrestaShop\Core\Domain\TaxRulesGroup\Command\EditTaxRulesGroupCommand;

/**
 * Defines contract for edit tax rules group handler
 */
interface EditTaxRulesGroupHandlerInterface
{
    /**
     * @param EditTaxRulesGroupCommand $command
     */
    public function handle(EditTaxRulesGroupCommand $command): void;
}
