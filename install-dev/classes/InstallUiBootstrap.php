<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

declare(strict_types=1);

/**
 * Builds JSON bootstrap payload for the Vue installer UI.
 */
class InstallUiBootstrap
{
    public function __construct(
        private InstallControllerHttp $controller,
    ) {
    }

    public function build(string $step): array
    {
        $steps = [];
        $menuSteps = [];
        foreach (InstallControllerHttp::getSteps() as $stepItem) {
            $name = $stepItem->getName();
            $finished = $this->controller->isStepFinished($name);
            $steps[] = [
                'name' => $name,
                'label' => (string) $stepItem,
                'finished' => $finished,
            ];
            $menuSteps[] = $this->buildMenuStep($stepItem);
        }

        return [
            'step' => $step,
            'isFirstStep' => $this->controller->isFirstStep(),
            'isLastStep' => $this->controller->isLastStep(),
            'nextButton' => (bool) $this->controller->next_button,
            'previousButton' => (bool) $this->controller->previous_button,
            'psBaseUri' => __PS_BASE_URI__,
            'psVersion' => _PS_INSTALL_VERSION_,
            'steps' => $steps,
            'menuSteps' => $menuSteps,
            'strings' => [
                'installationAssistant' => $this->trans('Installation Assistant'),
                'next' => $this->trans('Next'),
                'back' => $this->trans('Back'),
                'needJavascript' => $this->trans('To install PrestaShop, you need to have JavaScript enabled in your browser.'),
            ],
            'stepData' => $this->buildStepData($step),
        ];
    }

    private function buildMenuStep($stepItem): array
    {
        $name = $stepItem->getName();
        $label = (string) $stepItem;
        $current = InstallControllerHttp::getSteps()->current()->getName();

        if ($current === $name) {
            return ['name' => $name, 'label' => $label, 'className' => 'selected', 'href' => null];
        }
        if ($this->controller->isStepFinished($name)) {
            return ['name' => $name, 'label' => $label, 'className' => 'finished', 'href' => 'index.php?step=' . $name];
        }
        if ($name === $this->controller->getLastStep()) {
            return ['name' => $name, 'label' => $label, 'className' => 'configuring', 'href' => 'index.php?step=' . $name];
        }

        return ['name' => $name, 'label' => $label, 'className' => '', 'href' => null];
    }

    private function buildStepData(string $step): array
    {
        return match ($step) {
            'welcome' => $this->welcomeData(),
            'license' => $this->licenseData(),
            'system' => $this->systemData(),
            'configure' => $this->configureData(),
            'content' => $this->contentData(),
            'database' => $this->databaseData(),
            'process' => $this->processData(),
            default => [],
        };
    }

    private function welcomeData(): array
    {
        $c = $this->controller;
        $languages = [];
        foreach ($c->language->getIsoList() as $iso) {
            $languages[] = [
                'iso' => $iso,
                'name' => $c->language->getLanguage($iso)->getName(),
            ];
        }

        return [
            'canUpgrade' => (bool) $c->can_upgrade,
            'upgradeWarningHtml' => $c->can_upgrade
                ? $this->trans(
                    '<b>Warning: You cannot use this tool to upgrade your store anymore.</b><br /><br />You already have <b>PrestaShop version %version% installed</b>.<br /><br />If you want to upgrade to the latest version, please use the 1-Click Upgrade module and follow its instructions.',
                    ['%version%' => $c->ps_version]
                )
                : '',
            'title' => $this->trans('Welcome to the PrestaShop %version% Installer', ['%version%' => _PS_INSTALL_VERSION_]),
            'intro' => $this->trans(
                'Installing PrestaShop is quick and easy. In just a few moments, you will become part of a community consisting of more than %numMerchants% merchants. You are on the way to creating your own unique online store that you can manage easily every day.',
                ['%numMerchants%' => '300,000']
            ),
            'continueIn' => $this->trans('Continue the installation in:'),
            'languageNote' => $this->trans(
                'The language selection above only applies to the Installation Assistant. Once your store is installed, you can choose the language of your store from over %d% translations, all for free!',
                ['%d%' => 60]
            ),
            'language' => $c->language->getLanguageIso(),
            'languages' => $languages,
        ];
    }

    private function licenseData(): array
    {
        $c = $this->controller;

        return [
            'title' => $this->trans('License Agreements'),
            'intro' => $this->trans('To enjoy the many features that are offered for free by PrestaShop, please read the license terms below. PrestaShop core is licensed under OSL 3.0, while the modules and themes are licensed under AFL 3.0.'),
            'licenseHtml' => $c->getTemplate('license_content'),
            'licenceAgrement' => (bool) $c->session->licence_agrement,
            'agreeLabel' => $this->trans('I agree to the above terms and conditions.'),
            'privacyTitle' => $this->trans('Privacy note'),
            'privacyHtml' => $this->trans(
                'Some project modules may submit public and technical information about your store to the PrestaShop Project for analytics purposes. To learn more and make an informed choice, read %link%.',
                [
                    '%link%' => '<a href="https://www.prestashop-project.org/data-transparency/" target="_blank">' .
                        $this->trans('this article') .
                        '</a>',
                ]
            ),
        ];
    }

    private function systemData(): array
    {
        $c = $this->controller;

        return [
            'title' => $this->trans('We are currently checking PrestaShop compatibility with your system environment'),
            'requiredSuccess' => (bool) ($c->tests['required']['success'] ?? false),
            'okMessage' => $this->trans('PrestaShop compatibility with your system environment has been verified!'),
            'errorMessage' => $this->trans(
                'Oops! Please correct the item(s) below, and then click "%refresh_label%" to test the compatibility of your new system.',
                ['%refresh_label%' => $this->trans('Refresh information')]
            ),
            'refreshLabel' => $this->trans('Refresh information'),
            'testsRender' => $c->tests_render,
            'tests' => $c->tests,
        ];
    }

    private function configureData(): array
    {
        $c = $this->controller;
        $session = $c->session;

        return [
            'storeTitle' => $this->trans('Information about your Store'),
            'accountTitle' => $this->trans('Your Account'),
            'yes' => $this->trans('Yes'),
            'no' => $this->trans('No'),
            'selectTimezone' => $this->trans('Select your timezone'),
            'emailHelp' => $this->trans('This email address will be your username to access your store\'s back office.'),
            'passwordHelp' => $this->trans('Must be at least 8 characters'),
            'passwordMustBeStrong' => $this->trans('The password is incorrect (must be Strong)'),
            'passwordTranslations' => json_decode((string) $c->translatedStrings, true) ?: [],
            'labels' => [
                'shopName' => $this->trans('Store name'),
                'country' => $this->trans('Country'),
                'timezone' => $this->trans('Shop timezone'),
                'enableSsl' => $this->trans('Enable SSL'),
                'firstname' => $this->trans('First name'),
                'lastname' => $this->trans('Last name'),
                'email' => $this->trans('E-mail address'),
                'password' => $this->trans('Shop password'),
                'passwordConfirm' => $this->trans('Re-type to confirm'),
            ],
            'shopName' => (string) ($session->shop_name ?? ''),
            'shopCountry' => (string) ($session->shop_country ?? '0'),
            'shopTimezone' => (string) ($session->shop_timezone ?? '0'),
            'enableSsl' => (bool) $session->enable_ssl,
            'adminFirstname' => (string) ($session->admin_firstname ?? ''),
            'adminLastname' => (string) ($session->admin_lastname ?? ''),
            'adminEmail' => (string) ($session->admin_email ?? ''),
            'adminPassword' => (string) ($session->admin_password ?? ''),
            'adminPasswordConfirm' => (string) ($session->admin_password_confirm ?? ''),
            'countries' => $c->list_countries,
            'timezones' => $c->getTimezones(),
            'fieldErrors' => is_array($c->errors) ? $c->errors : [],
        ];
    }

    private function contentData(): array
    {
        $c = $this->controller;
        $themes = [];
        foreach ($c->themes as $theme) {
            $themes[] = [
                'name' => $theme->get('name'),
                'displayName' => $theme->get('display_name'),
                'preview' => $theme->get('preview'),
                'version' => $theme->get('version'),
            ];
        }

        $categories = [];
        foreach ($c->getModulesPerCategories() as $category) {
            if (empty($category->modules)) {
                continue;
            }
            $modules = [];
            foreach ($category->modules as $module) {
                $modules[] = [
                    'name' => $module->get('name'),
                    'displayName' => $module->get('displayName'),
                ];
            }
            $categories[] = [
                'name' => $category->name,
                'label' => $this->trans($category->name),
                'modules' => $modules,
            ];
        }

        $selected = $c->session->content_modules;
        if (!is_array($selected)) {
            $selected = [];
            foreach ($c->modules as $module) {
                $selected[] = $module->get('name');
            }
        }

        return [
            'title' => $this->trans('Content of your store'),
            'themeLabel' => $this->trans('Installation of theme'),
            'themeHelp' => $this->trans('Select the theme to install'),
            'versionLabel' => $this->trans('Version:'),
            'modulesLabel' => $this->trans('Installation of modules'),
            'modulesHelp' => $this->trans('If you are using PrestaShop for the first time, you should install all modules now and uninstall the ones you don\'t need later.'),
            'searchPlaceholder' => $this->trans('Search'),
            'selectAllLabel' => $this->trans('Select all'),
            'theme' => $c->session->content_theme,
            'themes' => $themes,
            'moduleAction' => (int) $c->moduleAction,
            'selectAll' => (bool) $c->selectAllButton,
            'selectedModules' => array_values($selected),
            'categories' => $categories,
            'moduleOptions' => [
                ['value' => InstallControllerHttpContent::MODULES_ALL, 'label' => $this->trans('Install all modules (recommended)')],
                ['value' => InstallControllerHttpContent::MODULES_SELECTED, 'label' => $this->trans('Select the modules to install')],
                ['value' => InstallControllerHttpContent::MODULES_NONE, 'label' => $this->trans('Install no modules')],
                ['value' => InstallControllerHttpContent::MODULES_BO_ONLY, 'label' => $this->trans('Back-office modules only (Administration)')],
                ['value' => InstallControllerHttpContent::MODULES_FO_ONLY, 'label' => $this->trans('Front-office modules only (exclude Administration)')],
            ],
        ];
    }

    private function databaseData(): array
    {
        $c = $this->controller;

        return [
            'title' => $this->trans('Configure your database by filling out the following fields'),
            'introHtml' => $this->trans('To use PrestaShop, you must <a href="https://devdocs.prestashop-project.org/9/basics/installation/#creating-a-database-for-your-shop" target="_blank">create a database</a> to collect all of your store\'s data-related activities.') .
                '<br />' .
                $this->trans('Please complete the fields below in order for PrestaShop to connect to your database.'),
            'labels' => [
                'server' => $this->trans('Database server address'),
                'serverHelp' => $this->trans('The default port is 3306. To use a different port, add the port number at the end of your server\'s address i.e ":4242".'),
                'name' => $this->trans('Database name'),
                'login' => $this->trans('Database login'),
                'password' => $this->trans('Database password'),
                'prefix' => $this->trans('Tables prefix'),
                'clear' => $this->trans('Drop existing tables'),
                'test' => $this->trans('Test your database connection now!'),
            ],
            'databaseServer' => (string) $c->database_server,
            'databaseName' => (string) $c->database_name,
            'databaseLogin' => (string) $c->database_login,
            'databasePassword' => (string) $c->database_password,
            'databasePrefix' => (string) $c->database_prefix,
            'databaseClear' => (bool) $c->database_clear,
            'errors' => is_array($c->errors) ? array_values($c->errors) : [],
        ];
    }

    private function processData(): array
    {
        $c = $this->controller;
        $password = (string) $c->session->admin_password;

        return [
            'processSteps' => $c->process_steps,
            'doneLabel' => $this->trans('Done!'),
            'errorTitle' => $this->trans('An error occurred during installation...'),
            'errorHelpHtml' => $this->trans(
                'You can use the links on the left column to go back to the previous steps, or restart the installation process by <a href="%link%">clicking here</a>.',
                ['%link%' => 'index.php?restart=true']
            ),
            'warningTitle' => $this->trans('A warning was triggered during installation'),
            'successTitle' => $this->trans('Your installation is finished!'),
            'successIntro' => $this->trans('You have just finished installing your shop. Thank you for using PrestaShop!'),
            'loginRemember' => $this->trans('Please remember your login information:'),
            'emailLabel' => $this->trans('E-mail'),
            'passwordLabel' => $this->trans('Password'),
            'displayLabel' => $this->trans('Display'),
            'printLabel' => $this->trans('Print my login information'),
            'deleteInstallFolder' => $this->trans('For security purposes, you must delete the "install" folder.'),
            'adminEmail' => (string) $c->session->admin_email,
            'adminPassword' => $password,
            'passwordMasked' => preg_replace('#.#', '*', $password),
            'adminFolderName' => (string) $c->session->adminFolderName,
            'boTitle' => $this->trans('Back Office'),
            'boDescription' => $this->trans('Manage your store using your Back Office. Manage your orders and customers, add modules, change themes, etc.'),
            'boButton' => $this->trans('Manage your store'),
            'foTitle' => $this->trans('Front Office'),
            'foDescription' => $this->trans('Discover your store as your future customers will see it!'),
            'foButton' => $this->trans('Discover your store'),
        ];
    }

    private function trans(string $id, array $parameters = []): string
    {
        return $this->controller->translator->trans($id, $parameters, 'Install');
    }
}
