<?php

if (!defined('_PS_VERSION_')) {
    exit;
}

class Ps_SearchbarOverride extends Ps_Searchbar
{
    public function hookDisplayHeader()
    {
        // FO search UI lives in the theme bundle (e.g. src/js/modules/ps_searchbar.ts).
        // Do not load core jQuery UI or the module's legacy autocomplete JS.
        $this->context->controller->registerStylesheet(
            'modules-searchbar',
            'modules/' . $this->name . '/ps_searchbar.css'
        );
    }
}
