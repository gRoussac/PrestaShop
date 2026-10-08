/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */
class LocalizationException {
  message: string;

  name: string;

  constructor(message: string) {
    this.message = message;
    this.name = 'LocalizationException';
  }
}

export default LocalizationException;
