<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

declare(strict_types=1);

use PrestaShopBundle\Install\Install;
use PrestaShop\PrestaShop\Core\Addon\Theme\Theme;
use PrestaShop\PrestaShop\Core\Util\ArrayFinder;
use PrestaShop\PrestaShop\Core\Util\File\YamlParser;
use PrestaShopBundle\Service\DataProvider\Admin\CategoriesProvider;

/**
 * Step 5: configure content
 */
class InstallControllerHttpContent extends InstallControllerHttp implements HttpConfigureInterface
{
    public const MODULES_ALL = 0;
    public const MODULES_SELECTED = 1;
    public const MODULES_NONE = 2;
    public const MODULES_BO_ONLY = 3;
    public const MODULES_FO_ONLY = 4;

    private const MODULE_CATEGORY_ADMINISTRATION = 'Administration';

    /**
     * Modules present on the disk
     *
     * @var array
     */
    public $modules = [];

    /**
     * Themes present on the disk
     *
     * @var array
     */
    public $themes = [];

    /**
     * Define the current action for modules
     *
     * @var int
     */
    public $moduleAction = self::MODULES_ALL;

    /**
     * Define if the select all modules is selected
     *
     * @var bool
     */
    public $selectAllButton = false;

    /**
     * Parent category name by module tab (from addons categories.yml).
     *
     * @var array<string, string>|null
     */
    private $parentCategoryByTab = null;

    public function init(): void
    {
        $this->model = new Install();
        $this->modules = $this->model->getModulesOnDisk();
        $this->themes = $this->model->getThemesOnDisk();
        if ($this->session->content_install_fixtures === null) {
            $this->session->content_install_fixtures = false;
        }
    }

    /**
     * {@inheritdoc}
     */
    public function processNextStep(): void
    {
        $moduleAction = (int) Tools::getValue('module-action');
        if (!in_array($moduleAction, $this->getAllowedModuleActions(), true)) {
            $moduleAction = static::MODULES_ALL;
        }

        $this->session->content_modules = $this->resolveContentModules($moduleAction);
        $this->session->moduleAction = $moduleAction;
        $this->session->content_theme = Tools::getValue('theme', null);
        if (Tools::getIsset('install-fixtures')) {
            $this->session->content_install_fixtures = (string) Tools::getValue('install-fixtures') === '1';
        }
    }

    /**
     * {@inheritdoc}
     */
    public function validate(): bool
    {
        return !empty($this->session->content_theme);
    }

    /**
     * {@inheritdoc}
     */
    public function display(): void
    {
        if ($this->session->content_theme === null) {
            foreach ($this->themes as $theme) {
                if ($theme->get('name') === Theme::getDefaultTheme()) {
                    $this->session->content_theme = $theme->get('name');
                    break;
                }
            }
        }

        $this->moduleAction = $this->session->moduleAction ?? static::MODULES_ALL;
        $this->selectAllButton = $this->session->content_modules === null || count($this->modules) === count($this->session->content_modules);

        $this->displayContent('content');
    }

    public function getModulesPerCategories(): array
    {
        $yamlParser = new YamlParser(_PS_CACHE_DIR_);
        $prestashopAddonsConfig = $yamlParser->parse(_PS_ROOT_DIR_ . '/app/config/addons/categories.yml');
        $categoriesProvider = new CategoriesProvider(
            $prestashopAddonsConfig['prestashop']['addons']['categories'],
            []
        );

        $categories = $categoriesProvider->getCategories()['categories']->subMenu;
        foreach ($this->modules as $module) {
            $tab = $this->findModuleCategory($module, $categories);
            $categories[$tab]->modules[] = $module;
        }

        foreach ($categories as $category) {
            uasort($category->modules, [$this, 'sortModulesByDisplayname']);
        }

        return $categories;
    }

    protected function sortModulesByDisplayName(ArrayFinder $a, ArrayFinder $b): int
    {
        return $a->get('displayName') <=> $b->get('displayName');
    }

    protected function findModuleCategory(ArrayFinder $module, array $categories)
    {
        $tab = $module->get('tab');
        if (!empty($tab)) {
            foreach ($categories as $category) {
                if ($tab === $category->tab) {
                    return $category->name;
                }
            }

            $parentName = $this->findParentCategoryNameByTab((string) $tab);
            if ($parentName !== null && isset($categories[$parentName])) {
                return $parentName;
            }
            foreach ($categories as $category) {
                if ($parentName === $category->name) {
                    return $category->name;
                }
            }
        }

        return CategoriesProvider::CATEGORY_OTHER;
    }

    /**
     * @return list<int>
     */
    private function getAllowedModuleActions(): array
    {
        return [
            static::MODULES_ALL,
            static::MODULES_SELECTED,
            static::MODULES_NONE,
            static::MODULES_BO_ONLY,
            static::MODULES_FO_ONLY,
        ];
    }

    /**
     * Resolve module names for the chosen install mode (server-side for non-SELECTED modes).
     *
     * @return list<string>
     */
    private function resolveContentModules(int $moduleAction): array
    {
        if ($moduleAction === static::MODULES_NONE) {
            return [];
        }

        if ($moduleAction === static::MODULES_SELECTED) {
            $selected = Tools::getValue('modules', []);

            return is_array($selected) ? array_values($selected) : [];
        }

        $allNames = [];
        foreach ($this->modules as $module) {
            $allNames[] = $module->get('name');
        }

        if ($moduleAction === static::MODULES_ALL) {
            return $allNames;
        }

        $administrationNames = $this->getModuleNamesInCategory(self::MODULE_CATEGORY_ADMINISTRATION);

        if ($moduleAction === static::MODULES_BO_ONLY) {
            return $administrationNames;
        }

        return array_values(array_diff($allNames, $administrationNames));
    }

    /**
     * @return list<string>
     */
    private function getModuleNamesInCategory(string $categoryName): array
    {
        $names = [];
        $categories = $this->getModulesPerCategories();
        if (!isset($categories[$categoryName]) || empty($categories[$categoryName]->modules)) {
            return [];
        }

        foreach ($categories[$categoryName]->modules as $module) {
            $names[] = $module->get('name');
        }

        return $names;
    }

    private function findParentCategoryNameByTab(string $tab): ?string
    {
        $map = $this->getParentCategoryByTabMap();

        return $map[$tab] ?? null;
    }

    /**
     * @return array<string, string>
     */
    private function getParentCategoryByTabMap(): array
    {
        if ($this->parentCategoryByTab !== null) {
            return $this->parentCategoryByTab;
        }

        $this->parentCategoryByTab = [];
        $yamlParser = new YamlParser(_PS_CACHE_DIR_);
        $prestashopAddonsConfig = $yamlParser->parse(_PS_ROOT_DIR_ . '/app/config/addons/categories.yml');
        $addonsCategories = $prestashopAddonsConfig['prestashop']['addons']['categories'] ?? [];

        foreach ($addonsCategories as $parentCategory) {
            $parentName = $parentCategory['name'] ?? null;
            if (!is_string($parentName) || $parentName === '') {
                continue;
            }
            foreach ($parentCategory['categories'] ?? [] as $childCategory) {
                $childTab = $childCategory['tab'] ?? null;
                if (is_string($childTab) && $childTab !== '') {
                    $this->parentCategoryByTab[$childTab] = $parentName;
                }
            }
        }

        return $this->parentCategoryByTab;
    }
}
