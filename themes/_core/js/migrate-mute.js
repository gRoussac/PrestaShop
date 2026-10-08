/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */
import jQuery from 'jquery';

(function () {
  if (typeof jQuery.migrateMute === 'undefined') {
    jQuery.migrateMute = !window.prestashop.debug;
  }
}());
