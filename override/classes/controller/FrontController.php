<?php
/**
 * FO overrides: asset cache-bust, lean JSON-LD, password-policy template only where needed.
 */
class FrontController extends FrontControllerCore
{
    /**
     * {@inheritdoc}
     */
    public function setMedia()
    {
        $themeDir = _PS_THEME_DIR_;
        $themeCssVersion = is_readable($themeDir . 'assets/css/theme.css')
            ? (string) filemtime($themeDir . 'assets/css/theme.css')
            : null;
        $themeJsVersion = is_readable($themeDir . 'assets/js/theme.js')
            ? (string) filemtime($themeDir . 'assets/js/theme.js')
            : null;

        $this->registerStylesheet('theme-main', '/assets/css/theme.css', ['media' => 'all', 'priority' => 50, 'version' => $themeCssVersion]);
        $this->registerStylesheet('theme-custom', '/assets/css/custom.css', ['media' => 'all', 'priority' => 1000]);

        if ($this->context->language->is_rtl) {
            $this->registerStylesheet('theme-rtl', '/assets/css/rtl.css', ['media' => 'all', 'priority' => 900]);
        }

        if ($this->context->shop->theme->requiresCoreScripts()) {
            $coreJsVersion = is_readable(_PS_ROOT_DIR_ . '/themes/core.js')
                ? (string) filemtime(_PS_ROOT_DIR_ . '/themes/core.js')
                : null;
            $this->registerJavascript('corejs', '/themes/core.js', ['position' => 'bottom', 'priority' => 0, 'version' => $coreJsVersion]);
        }
        $this->registerJavascript('theme-main', '/assets/js/theme.js', ['position' => 'bottom', 'priority' => 50, 'version' => $themeJsVersion]);
        $this->registerJavascript('theme-custom', '/assets/js/custom.js', ['position' => 'bottom', 'priority' => 1000]);

        $assets = $this->context->shop->theme->getPageSpecificAssets($this->php_self);
        if (!empty($assets)) {
            foreach ($assets['css'] as $css) {
                $this->registerStylesheet($css['id'], $css['path'], $css);
            }
            foreach ($assets['js'] as $js) {
                $this->registerJavascript($js['id'], $js['path'], $js);
            }
        }

        Hook::exec('actionFrontControllerSetMedia');
        Hook::exec('action' . $this->getControllerName() . 'SetMedia');

        return true;
    }

    /**
     * {@inheritdoc}
     */
    protected function assignGeneralPurposeVariables()
    {
        parent::assignGeneralPurposeVariables();

        if ($this->needsPasswordPolicyTemplate()) {
            $this->context->smarty->assign(
                'password_policy_feedbacks',
                $this->getPasswordPolicyFeedbacks()
            );
        }
    }

    /**
     * {@inheritdoc}
     */
    public function getTemplateVarPage()
    {
        $page = parent::getTemplateVarPage();
        unset($page['password-policy']);
        $this->templateVarPageCache = $page;

        return $page;
    }

    /**
     * {@inheritdoc}
     */
    public function getStructuredData()
    {
        $structuredData = parent::getStructuredData();

        if (isset($structuredData['organization']) && is_array($structuredData['organization'])) {
            unset(
                $structuredData['organization']['email'],
                $structuredData['organization']['telephone'],
                $structuredData['organization']['address']
            );
        }

        return $structuredData;
    }

    /**
     * Pages that render a new-password field (zxcvbn hints template).
     */
    protected function needsPasswordPolicyTemplate(): bool
    {
        return in_array(
            (string) $this->php_self,
            ['authentication', 'registration', 'password', 'identity', 'order'],
            true
        );
    }

    /**
     * Translated zxcvbn feedback strings for the password-policy template only (not in FO JS).
     *
     * @return array<int|string, string>
     */
    protected function getPasswordPolicyFeedbacks(): array
    {
        $t = $this->getTranslator();

        return [
            0 => $t->trans('Very weak', [], 'Shop.Theme.Global'),
            1 => $t->trans('Weak', [], 'Shop.Theme.Global'),
            2 => $t->trans('Average', [], 'Shop.Theme.Global'),
            3 => $t->trans('Strong', [], 'Shop.Theme.Global'),
            4 => $t->trans('Very strong', [], 'Shop.Theme.Global'),
            'Straight rows of keys are easy to guess' => $t->trans('Straight rows of keys are easy to guess', [], 'Shop.Theme.Global'),
            'Short keyboard patterns are easy to guess' => $t->trans('Short keyboard patterns are easy to guess', [], 'Shop.Theme.Global'),
            'Use a longer keyboard pattern with more turns' => $t->trans('Use a longer keyboard pattern with more turns', [], 'Shop.Theme.Global'),
            'Repeats like "aaa" are easy to guess' => $t->trans('Repeats like "aaa" are easy to guess', [], 'Shop.Theme.Global'),
            'Repeats like "abcabcabc" are only slightly harder to guess than "abc"' => $t->trans('Repeats like "abcabcabc" are only slightly harder to guess than "abc"', [], 'Shop.Theme.Global'),
            'Sequences like abc or 6543 are easy to guess' => $t->trans('Sequences like "abc" or "6543" are easy to guess', [], 'Shop.Theme.Global'),
            'Recent years are easy to guess' => $t->trans('Recent years are easy to guess', [], 'Shop.Theme.Global'),
            'Dates are often easy to guess' => $t->trans('Dates are often easy to guess', [], 'Shop.Theme.Global'),
            'This is a top-10 common password' => $t->trans('This is a top-10 common password', [], 'Shop.Theme.Global'),
            'This is a top-100 common password' => $t->trans('This is a top-100 common password', [], 'Shop.Theme.Global'),
            'This is a very common password' => $t->trans('This is a very common password', [], 'Shop.Theme.Global'),
            'This is similar to a commonly used password' => $t->trans('This is similar to a commonly used password', [], 'Shop.Theme.Global'),
            'A word by itself is easy to guess' => $t->trans('A word by itself is easy to guess', [], 'Shop.Theme.Global'),
            'Names and surnames by themselves are easy to guess' => $t->trans('Names and surnames by themselves are easy to guess', [], 'Shop.Theme.Global'),
            'Common names and surnames are easy to guess' => $t->trans('Common names and surnames are easy to guess', [], 'Shop.Theme.Global'),
            'Use a few words, avoid common phrases' => $t->trans('Use a few words, avoid common phrases', [], 'Shop.Theme.Global'),
            'No need for symbols, digits, or uppercase letters' => $t->trans('No need for symbols, digits, or uppercase letters', [], 'Shop.Theme.Global'),
            'Avoid repeated words and characters' => $t->trans('Avoid repeated words and characters', [], 'Shop.Theme.Global'),
            'Avoid sequences' => $t->trans('Avoid sequences', [], 'Shop.Theme.Global'),
            'Avoid recent years' => $t->trans('Avoid recent years', [], 'Shop.Theme.Global'),
            'Avoid years that are associated with you' => $t->trans('Avoid years that are associated with you', [], 'Shop.Theme.Global'),
            'Avoid dates and years that are associated with you' => $t->trans('Avoid dates and years that are associated with you', [], 'Shop.Theme.Global'),
            'Capitalization doesn\'t help very much' => $t->trans('Capitalization doesn\'t help very much', [], 'Shop.Theme.Global'),
            'All-uppercase is almost as easy to guess as all-lowercase' => $t->trans('All-uppercase is almost as easy to guess as all-lowercase', [], 'Shop.Theme.Global'),
            'Reversed words aren\'t much harder to guess' => $t->trans('Reversed words aren\'t much harder to guess', [], 'Shop.Theme.Global'),
            'Predictable substitutions like \'@\' instead of \'a\' don\'t help very much' => $t->trans('Predictable substitutions like "@" instead of "a" don\'t help very much', [], 'Shop.Theme.Global'),
            'Add another word or two. Uncommon words are better.' => $t->trans('Add another word or two. Uncommon words are better.', [], 'Shop.Theme.Global'),
        ];
    }
}
