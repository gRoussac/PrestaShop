<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Addon;

interface AddonInterface
{
    public function onInstall();

    public function onUninstall();

    public function onEnable();

    public function onDisable();

    public function onReset();

    public function onUpgrade($version);
}
