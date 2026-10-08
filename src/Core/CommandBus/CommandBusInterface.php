<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\CommandBus;

/**
 * Interface CommandBusInterface defines contract for Commands bus.
 */
interface CommandBusInterface
{
    /**
     * Handle command.
     *
     * @param object $command
     */
    public function handle($command);
}
