<?php
/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Core\MailTemplate\Transformation;

use PrestaShop\PrestaShop\Core\Data\AbstractTypedCollection;

class TransformationCollection extends AbstractTypedCollection implements TransformationCollectionInterface
{
    /**
     * {@inheritdoc}
     */
    protected function getType()
    {
        return TransformationInterface::class;
    }
}
