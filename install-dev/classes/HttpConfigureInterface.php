<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

declare(strict_types=1);

interface HttpConfigureInterface
{
    /**
     * Process form to go to next step
     */
    public function processNextStep(): void;

    /**
     * Validate current step
     */
    public function validate(): bool;

    /**
     * Display current step view
     */
    public function display(): void;
}
