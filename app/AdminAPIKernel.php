<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

declare(strict_types=1);

class AdminAPIKernel extends AppKernel
{
    public const APP_ID = 'admin-api';

    public function getAppId(): string
    {
        return self::APP_ID;
    }
}
