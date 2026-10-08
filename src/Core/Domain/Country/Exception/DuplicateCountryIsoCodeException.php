<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShop\PrestaShop\Core\Domain\Country\Exception;

/**
 * Is thrown when an ISO code which already exists is used to create or update another country
 */
class DuplicateCountryIsoCodeException extends CountryException
{
}
