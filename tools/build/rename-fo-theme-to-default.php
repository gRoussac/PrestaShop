<?php
/**
 * Composer installs the upstream FO theme package into themes/<package-dir>.
 * Promote it to themes/default and drop classic leftovers.
 */

declare(strict_types=1);

$root = dirname(__DIR__, 2);
$themesDir = $root . '/themes';
$classicDir = $themesDir . '/classic';
// Upstream package directory name on disk after Composer extract.
$sourceDir = $themesDir . '/hummingbird';
$defaultDir = $themesDir . '/default';

function removeDirectory(string $path): void
{
    if (!is_dir($path)) {
        return;
    }

    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($path, FilesystemIterator::SKIP_DOTS),
        RecursiveIteratorIterator::CHILD_FIRST
    );

    foreach ($iterator as $fileInfo) {
        $target = $fileInfo->getPathname();
        if ($fileInfo->isDir()) {
            rmdir($target);
            continue;
        }
        unlink($target);
    }

    rmdir($path);
}

removeDirectory($classicDir);

if (is_dir($sourceDir)) {
    if (is_dir($defaultDir)) {
        removeDirectory($defaultDir);
    }
    if (!rename($sourceDir, $defaultDir)) {
        fwrite(STDERR, "Failed to promote FO theme package dir to themes/default\n");
        exit(1);
    }
}

if (!is_dir($defaultDir)) {
    // Composer --no-install / lock-only updates never extract themes.
    echo "Skipping FO theme rename (themes/default not present yet)\n";
    exit(0);
}

$themeYml = $defaultDir . '/config/theme.yml';
if (!is_file($themeYml)) {
    fwrite(STDERR, "Missing theme.yml in themes/default\n");
    exit(1);
}

$contents = file_get_contents($themeYml);
if ($contents === false) {
    fwrite(STDERR, "Unable to read theme.yml\n");
    exit(1);
}

$updated = preg_replace('/^name:\s*.+$/m', 'name: default', $contents, 1);
if (!is_string($updated)) {
    fwrite(STDERR, "Unable to patch theme.yml name\n");
    exit(1);
}

if (file_put_contents($themeYml, $updated) === false) {
    fwrite(STDERR, "Unable to write theme.yml\n");
    exit(1);
}

echo "FO theme ready at themes/default\n";
