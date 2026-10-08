<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

use Symfony\Component\Dotenv\Dotenv;

// Set front dir constant to use after
if (!defined('_PS_FRONT_DIR_')) {
    define('_PS_FRONT_DIR_', dirname(__FILE__));
}

// Include some configurations & composer autoload
require_once _PS_FRONT_DIR_ . '/config/config.inc.php';
require_once _PS_FRONT_DIR_ . '/vendor/autoload.php';
define('_PS_APP_ID_', FrontKernel::APP_ID);

// Load .env file from the root of project if present
(new Dotenv(false))->loadEnv(_PS_FRONT_DIR_ . '/.env');

Dispatcher::getInstance()->dispatch();
