<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\Country;

use PrestaShop\PrestaShop\Core\Domain\Country\ValueObject\CountryId;

interface CountryZipCodeRequirementsProviderInterface
{
    /**
     * @param CountryId $countryId
     *
     * @return CountryZipCodeRequirements
     */
    public function getCountryZipCodeRequirements(CountryId $countryId): CountryZipCodeRequirements;
}
