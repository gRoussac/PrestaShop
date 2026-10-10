<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

declare(strict_types=1);

use PrestaShop\PrestaShop\Core\Util\ArrayFinder;
use PrestaShop\PrestaShop\Core\Util\File\YamlParser;

/**
 * Resolves which module names to install for HTTP content modes and CLI --modules.
 */
class InstallModuleListResolver
{
    public const MODE_ALL = 'all';
    public const MODE_NONE = 'none';
    public const MODE_BO = 'bo';
    public const MODE_FO = 'fo';

    private const CATEGORY_ADMINISTRATION = 'Administration';

    /**
     * @var array<string, string>|null
     */
    private ?array $parentCategoryByTab = null;

    /**
     * @param list<ArrayFinder> $modulesOnDisk
     *
     * @return list<string>
     */
    public function resolveFromHttpAction(int $moduleAction, array $modulesOnDisk, array $selectedModules = []): array
    {
        if ($moduleAction === InstallControllerHttpContent::MODULES_NONE) {
            return [];
        }

        if ($moduleAction === InstallControllerHttpContent::MODULES_SELECTED) {
            return array_values(array_filter($selectedModules, static fn ($name) => is_string($name) && $name !== ''));
        }

        $allNames = $this->allNames($modulesOnDisk);

        if ($moduleAction === InstallControllerHttpContent::MODULES_ALL) {
            return $allNames;
        }

        $administrationNames = $this->namesInAdministration($modulesOnDisk);

        if ($moduleAction === InstallControllerHttpContent::MODULES_BO_ONLY) {
            return $administrationNames;
        }

        if ($moduleAction === InstallControllerHttpContent::MODULES_FO_ONLY) {
            return array_values(array_diff($allNames, $administrationNames));
        }

        return $allNames;
    }

    /**
     * CLI --modules value: empty/none, all, bo, fo, or comma-separated names.
     *
     * @param list<ArrayFinder> $modulesOnDisk
     *
     * @return list<string>
     */
    public function resolveFromCliSpec(string $spec, array $modulesOnDisk): array
    {
        $normalized = strtolower(trim($spec));
        if ($normalized === '' || $normalized === self::MODE_NONE) {
            return [];
        }

        if ($normalized === self::MODE_ALL) {
            return $this->allNames($modulesOnDisk);
        }

        if ($normalized === self::MODE_BO) {
            return $this->namesInAdministration($modulesOnDisk);
        }

        if ($normalized === self::MODE_FO) {
            return array_values(array_diff(
                $this->allNames($modulesOnDisk),
                $this->namesInAdministration($modulesOnDisk)
            ));
        }

        $names = [];
        foreach (explode(',', $spec) as $name) {
            $name = trim($name);
            if ($name !== '') {
                $names[] = $name;
            }
        }

        return $names;
    }

    /**
     * @param list<ArrayFinder> $modulesOnDisk
     *
     * @return list<string>
     */
    public function namesInAdministration(array $modulesOnDisk): array
    {
        $names = [];
        foreach ($modulesOnDisk as $module) {
            if ($this->parentCategoryName($module) === self::CATEGORY_ADMINISTRATION) {
                $names[] = $module->get('name');
            }
        }

        return $names;
    }

    /**
     * @param list<ArrayFinder> $modulesOnDisk
     *
     * @return list<string>
     */
    private function allNames(array $modulesOnDisk): array
    {
        $names = [];
        foreach ($modulesOnDisk as $module) {
            $names[] = $module->get('name');
        }

        return $names;
    }

    private function parentCategoryName(ArrayFinder $module): string
    {
        $tab = $module->get('tab');
        if (!is_string($tab) || $tab === '') {
            return '';
        }

        $map = $this->getParentCategoryByTabMap();
        if (isset($map[$tab])) {
            return $map[$tab];
        }

        // Direct parent tab match (e.g. administration on Administration).
        foreach ($map as $childTab => $parentName) {
            if ($childTab === $tab) {
                return $parentName;
            }
        }

        $yamlParser = new YamlParser(_PS_CACHE_DIR_);
        $config = $yamlParser->parse(_PS_ROOT_DIR_ . '/app/config/addons/categories.yml');
        foreach ($config['prestashop']['addons']['categories'] ?? [] as $parentCategory) {
            $parentName = $parentCategory['name'] ?? null;
            $parentTab = $parentCategory['tab'] ?? null;
            if (is_string($parentName) && is_string($parentTab) && $parentTab === $tab) {
                return $parentName;
            }
        }

        return '';
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
        $config = $yamlParser->parse(_PS_ROOT_DIR_ . '/app/config/addons/categories.yml');

        foreach ($config['prestashop']['addons']['categories'] ?? [] as $parentCategory) {
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
