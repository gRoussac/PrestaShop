// Import utils
import testContext from '@utils/testContext';

import {expect} from 'chai';
import {
  foDefaultHomePage,
} from '@utils/foDefaultPages';

import {
  type BrowserContext,
  type Page,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_FO_default_homePage_checkSlider';

describe('FO - Home Page : Check slider', async () => {
  let browserContext: BrowserContext;
  let page: Page;

  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  describe('Check slider', async () => {
    it('should open the shop page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'openShopFO', baseContext);

      await foDefaultHomePage.goTo(page, global.FO.URL);

      const result = await foDefaultHomePage.isHomePage(page);
      expect(result).to.equal(true);
    });

    it('should click in right arrow of the slider', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'clickOnRightSlideArrow', baseContext);

      let isVisible = await foDefaultHomePage.isSliderVisible(page, 1);
      expect(isVisible).to.equal(true);

      await foDefaultHomePage.clickOnLeftOrRightArrow(page, 'next');

      isVisible = await foDefaultHomePage.isSliderVisible(page, 2);
      expect(isVisible).to.equal(true);
    });

    it('should click in left arrow of the slider', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'clickOnLeftSlideArrow', baseContext);

      let isVisible = await foDefaultHomePage.isSliderVisible(page, 2);
      expect(isVisible).to.equal(true);

      await foDefaultHomePage.clickOnLeftOrRightArrow(page, 'prev');

      isVisible = await foDefaultHomePage.isSliderVisible(page, 1);
      expect(isVisible).to.equal(true);
    });

    it('should check the slider URL', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkSliderURL', baseContext);

      const currentURL = await foDefaultHomePage.getSliderURL(page);
      expect(currentURL).to.contains('www.prestashop-project.org');
    });
  });
});
