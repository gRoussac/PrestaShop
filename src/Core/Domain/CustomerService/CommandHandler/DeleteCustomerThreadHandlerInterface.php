<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Domain\CustomerService\CommandHandler;

use PrestaShop\PrestaShop\Core\Domain\CustomerService\Command\DeleteCustomerThreadCommand;

/**
 * Delete customer thread
 */
interface DeleteCustomerThreadHandlerInterface
{
    public function handle(DeleteCustomerThreadCommand $command): void;
}
