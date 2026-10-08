<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Domain\MailTemplate\CommandHandler;

use PrestaShop\PrestaShop\Core\Domain\MailTemplate\Command\EditEmailBodyTemplateCommand;

interface EditEmailBodyTemplateHandlerInterface
{
    public function handle(EditEmailBodyTemplateCommand $command): void;
}
