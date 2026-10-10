<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

declare(strict_types=1);

/**
 * Session bag for the HTTP installer (PHP session or Cookie fallback).
 *
 * Wizard navigation:
 * @property string $last_step
 * @property string $step
 * @property string|null $lang
 * @property array $process_validated
 *
 * Database step:
 * @property string $database_server
 * @property string $database_login
 * @property string $database_password
 * @property string $database_name
 * @property string $database_prefix
 * @property string $database_engine
 * @property bool $database_clear Drop existing tables (default true on first load)
 * @property int $rewrite_engine
 *
 * Configure step (store + admin account):
 * @property string $shop_name
 * @property string $shop_country
 * @property string $shop_timezone
 * @property bool|null $enable_ssl
 * @property string $admin_firstname
 * @property string $admin_lastname
 * @property string $admin_password
 * @property string $admin_password_confirm
 * @property string $admin_email
 * @property string $adminFolderName
 *
 * Content step:
 * @property array|null $content_modules Module names to install (resolved server-side)
 * @property string|null $content_theme
 * @property bool|null $content_install_fixtures Always false (no demonstration catalog)
 * @property int|null $moduleAction InstallControllerHttpContent::MODULES_* constant
 *
 * License / agreements:
 * @property bool $licence_agrement
 * @property bool $configuration_agrement
 *
 * Misc / legacy:
 * @property string $install_type
 * @property array $xml_loader_ids
 * @property bool $use_smtp
 * @property string $smtp_encryption
 * @property int $smtp_port
 */
class InstallSession
{
    protected static $_instance;
    protected static $_cookie_mode = false;
    protected static $_cookie = false;

    public static function getInstance(): self
    {
        if (!static::$_instance) {
            static::$_instance = new static();
        }

        return static::$_instance;
    }

    public function __construct()
    {
        session_name('install_' . substr(md5($_SERVER['HTTP_HOST']), 0, 12));
        $session_started = session_start();
        if (!$session_started) {
            static::$_cookie_mode = true;
            static::$_cookie = new Cookie('ps_install', '', time() + 7200, null, true);

            return;
        }
        if (!isset($_SESSION['session_mode'])) {
            $_SESSION['session_mode'] = 'session';
        }
    }

    public function clean(): void
    {
        if (static::$_cookie_mode) {
            static::$_cookie->logout();
        } else {
            foreach ($_SESSION as $k => $v) {
                unset($_SESSION[$k]);
            }
        }
    }

    public function &__get($varname)
    {
        if (static::$_cookie_mode) {
            $ref = static::$_cookie->{$varname};
            if (0 === strncmp($ref, 'serialized_array:', strlen('serialized_array:'))) {
                $ref = unserialize(substr($ref, strlen('serialized_array:')));
            }
        } else {
            if (isset($_SESSION[$varname])) {
                $ref = &$_SESSION[$varname];
            } else {
                $null = null;
                $ref = &$null;
            }
        }

        return $ref;
    }

    public function __set($varname, $value)
    {
        if (static::$_cookie_mode) {
            if ($varname == 'xml_loader_ids') {
                return;
            }
            if (is_array($value)) {
                $value = 'serialized_array:' . serialize($value);
            }
            static::$_cookie->{$varname} = $value;
        } else {
            $_SESSION[$varname] = $value;
        }
    }

    public function __isset($varname)
    {
        if (static::$_cookie_mode) {
            return isset(static::$_cookie->{$varname});
        }

        return isset($_SESSION[$varname]);
    }

    public function __unset($varname)
    {
        if (static::$_cookie_mode) {
            unset(static::$_cookie->{$varname});
        } else {
            unset($_SESSION[$varname]);
        }
    }
}
