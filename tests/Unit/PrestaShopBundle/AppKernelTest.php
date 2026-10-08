<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace Tests\Unit\PrestaShopBundle;

use AppKernel;
use PHPUnit\Framework\TestCase;
use PrestaShop\PrestaShop\Core\Version;

class AppKernelTest extends TestCase
{
    public function testVersion(): void
    {
        self::assertSame(AppKernel::VERSION, Version::VERSION);
    }
}
