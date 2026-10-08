<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShop\PrestaShop\Core\Domain\Title\Exception;

/**
 * Thrown on failure to update title
 */
class CannotUpdateTitleException extends TitleException
{
    /**
     * When title update fails
     */
    public const FAILED_UPDATE_TITLE = 10;
}
