/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

const {$} = window;

/**
 * Enable all datepickers.
 */
const initInvalidFields = () => {
  $('input,select,textarea').on('invalid', function scroll() {
    this.scrollIntoView(false);
  });
};

export default initInvalidFields;
