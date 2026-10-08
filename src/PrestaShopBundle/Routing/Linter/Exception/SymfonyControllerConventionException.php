<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShopBundle\Routing\Linter\Exception;

class SymfonyControllerConventionException extends LinterException
{
    /**
     * @var string
     */
    private $invalidController;

    /**
     * {@inheritDoc}
     */
    public function __construct($message, string $invalidController)
    {
        parent::__construct($message, 0, null);
        $this->invalidController = $invalidController;
    }

    /**
     * @return string
     */
    public function getInvalidController()
    {
        return $this->invalidController;
    }
}
