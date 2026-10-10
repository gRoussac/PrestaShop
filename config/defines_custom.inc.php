<?php
/**
 * Kill PrestaShop phone-home API endpoints.
 * Loaded before defines_uri.inc.php (see config.inc.php).
 *
 * Currency feed is also pointed at a dead local URL for now.
 * Live exchange-rate updates from PrestaShop are disabled until a local
 * or third-party feed strategy is chosen.
 */

if (!defined('_PS_API_DOMAIN_')) {
    define('_PS_API_DOMAIN_', '127.0.0.1');
}
if (!defined('_PS_API_URL_')) {
    // Dead local URL: Upgrader / MD5 checks / remote localization packs fail fast.
    define('_PS_API_URL_', 'http://127.0.0.1');
}
if (!defined('_PS_CURRENCY_FEED_URL_')) {
    define('_PS_CURRENCY_FEED_URL_', 'http://127.0.0.1/xml/currencies.xml');
}
