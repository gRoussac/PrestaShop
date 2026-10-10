<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */
$installAppJs = _PS_INSTALL_PATH_ . 'theme/js/install-app.js';
$installAppCss = _PS_INSTALL_PATH_ . 'theme/css/install-app.css';
$viewCss = _PS_INSTALL_PATH_ . 'theme/view.css';
$bootstrapJson = json_encode(
    $this->install_ui_bootstrap ?? ['step' => 'welcome', 'strings' => [], 'stepData' => []],
    JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_UNESCAPED_UNICODE
);
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
  <head>
    <title><?php echo $this->translator->trans('PrestaShop Installation', [], 'Install'); ?></title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta http-equiv="Cache-Control" content="no-cache, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Cache" content="no store" />
    <meta http-equiv="Expires" content="-1" />
    <meta name="robots" content="noindex" />
    <link rel="shortcut icon" href="theme/img/favicon.ico" />
    <link rel="stylesheet" type="text/css" media="all" href="theme/view.css?version=<?php echo rawurlencode(_PS_VERSION_ . '.' . (string) filemtime($viewCss)); ?>" />
    <?php if (is_file($installAppCss)) { ?>
      <link rel="stylesheet" type="text/css" media="all" href="theme/css/install-app.css?version=<?php echo rawurlencode(_PS_VERSION_ . '.' . (string) filemtime($installAppCss)); ?>" />
    <?php } ?>

    <?php if ($this->language->getLanguage()->isRtl() == 'true') { ?>
      <link rel="stylesheet" type="text/css" media="all" href="theme/rtl.css" />
    <?php } ?>

    <script type="text/javascript">
      window.__INSTALL_BOOTSTRAP__ = <?php echo $bootstrapJson; ?>;
      var ps_base_uri = '<?php echo addslashes(__PS_BASE_URI__); ?>';
      var ps_version = '<?php echo addslashes(_PS_INSTALL_VERSION_); ?>';
    </script>
  </head>

  <body>
    <div id="install-app"></div>
    <?php if (is_file($installAppJs)) { ?>
      <script src="theme/js/install-app.js?version=<?php echo rawurlencode(_PS_VERSION_ . '.' . (string) filemtime($installAppJs)); ?>"></script>
    <?php } else { ?>
      <p class="errorBlock">
        <?php echo $this->translator->trans('Installer UI assets are missing. Run make install-ui from a development checkout.', [], 'Install'); ?>
      </p>
    <?php } ?>
  </body>
</html>
