// Import utils
import testContext from '@utils/testContext';

import {expect} from 'chai';
import {
  foDefaultHomePage,
  foDefaultProductPage,
} from '@utils/foDefaultPages';

import {
  type BrowserContext,
  dataProducts,
  type Page,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_FO_default_homePage_selectColor';

describe('FO - Home Page : Select color', async () => {
  let browserContext: BrowserContext;
  let page: Page;

  // before and after functions
  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  describe('Select color', async () => {
    it('should open the shop page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToShopFO', baseContext);

      await foDefaultHomePage.goTo(page, global.FO.URL);

      const result = await foDefaultHomePage.isHomePage(page);
      expect(result).to.equal(true);
    });

    it('should select the color White for the first product in list', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'selectColor1', baseContext);

      await foDefaultHomePage.selectProductColor(page, 1, 'White');

      const pageTitle = await foDefaultProductPage.getPageTitle(page);
      expect(pageTitle).to.contains(dataProducts.demo_1.name);
    });

    it('should check that the displayed product is white', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkDisplayedProduct', baseContext);

      const pageURL = await foDefaultProductPage.getCurrentURL(page);
      expect(pageURL).to.contains('color-white');
      // @todo : https://github.com/PrestaShop/PrestaShop/issues/35481
      // .and.to.contains('size-m');
    });

    it('should go to Home page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToHomePage', baseContext);

      await foDefaultProductPage.goToHomePage(page);

      const isHomePage = await foDefaultHomePage.isHomePage(page);
      expect(isHomePage, 'Home page is not displayed').to.eq(true);
    });

    it('should select the color Black for the first product in list', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'selectColor2', baseContext);

      await foDefaultHomePage.selectProductColor(page, 1, 'Black');

      const pageTitle = await foDefaultProductPage.getPageTitle(page);
      expect(pageTitle).to.contains(dataProducts.demo_1.name);
    });

    it('should check that the displayed product is white', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkDisplayedProduct2', baseContext);

      const pageURL = await foDefaultProductPage.getCurrentURL(page);
      expect(pageURL).to.contains('color-black');
      // @todo : https://github.com/PrestaShop/PrestaShop/issues/35481
      // .and.to.contains('size-m');
    });
  });
});
