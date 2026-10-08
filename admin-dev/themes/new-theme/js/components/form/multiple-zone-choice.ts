/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

export default class MultipleZoneChoice {
  constructor() {
    this.initZoneChoice();
  }

  initZoneChoice(): void {
    const $multipleZoneChoice = $('.js-multiple-zone-choice');
    $multipleZoneChoice.select2(
      {
        multiple: true,
        theme: 'classic',
        placeholder: $multipleZoneChoice.data('placeholder'),
      },
    );
  }
}
