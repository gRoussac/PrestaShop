<?php

if (!defined('_PS_VERSION_')) {
    exit;
}

class Ps_EmailalertsOverride extends Ps_Emailalerts
{
    public function hookActionFrontControllerSetMedia()
    {
        // FO mail alerts live in the theme bundle (e.g. src/js/modules/ps_emailalerts.ts).
        // Do not load modules/ps_emailalerts/js/mailalerts.js (jQuery .on('ready')).
    }
}
