import testContext from '@utils/testContext';
import {expect} from 'chai';

import {
  foDefaultCategoryPage,
  foDefaultHomePage,
  foDefaultNewProductsPage,
} from '@utils/foDefaultPages';

import {
  type BrowserContext,
  type Page,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_FO_default_homePage_displaySomeProducts';

/*
Scenario:
- Go to FO
- Check the block of popular products
- Check the banner and the custom text block
- Check the block of new products
 */
describe('FO - Home Page : Display some products', async () => {
  let browserContext: BrowserContext;
  let page: Page;

  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  describe('Check popular products block', async () => {
    it('should open the shop page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToShopFO', baseContext);

      await foDefaultHomePage.goTo(page, global.FO.URL);

      const result = await foDefaultHomePage.isHomePage(page);
      expect(result).to.eq(true);
    });

    it('should check popular product title', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkPopularProducts', baseContext);

      await foDefaultHomePage.changeLanguage(page, 'en');

      const popularProductTitle = await foDefaultHomePage.getBlockTitle(page, 'ps-featuredproducts');
      expect(popularProductTitle).to.equal('Featured products');
    });

    it('should check the number of popular products', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkPopularProductsNumber', baseContext);

      const productsNumber = await foDefaultHomePage.getProductsBlockNumber(page, 'ps-featuredproducts');
      expect(productsNumber).to.equal(4);
    });

    it('should check All products link', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkAllPopularProductsLink', baseContext);

      await foDefaultHomePage.goToAllProductsPage(page, 'ps-featuredproducts');

      const isCategoryPageVisible = await foDefaultCategoryPage.isCategoryPage(page);
      expect(isCategoryPageVisible, 'Home category page was not opened').to.eq(true);
    });

    it('should go to home page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToHomePage1', baseContext);

      await foDefaultHomePage.goToHomePage(page);

      const isHomePage = await foDefaultHomePage.isHomePage(page);
      expect(isHomePage, 'Home page is not displayed').to.eq(true);
    });
  });

  describe('Check the banner and the custom text block', async () => {
    it('should check that the banner is displayed', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkBanner', baseContext);

      const isVisible = await foDefaultHomePage.isBannerVisible(page);
      expect(isVisible).to.eq(true);
    });

    it('should check that the custom text block is visible', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkCustomTextBlock', baseContext);

      const isVisible = await foDefaultHomePage.isCustomTextBlockVisible(page);
      expect(isVisible).to.eq(true);
    });
  });

  describe('Check new products block', async () => {
    it('should check new products title', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkNewProductsBlock', baseContext);

      const popularProductTitle = await foDefaultHomePage.getBlockTitle(page, 'ps-newproducts');
      expect(popularProductTitle).to.equal('Latest arrivals');
    });

    it('should check the number of new products', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkNewProductsNumber', baseContext);

      const productsNumber = await foDefaultHomePage.getProductsBlockNumber(page, 'ps-newproducts');
      expect(productsNumber).to.equal(4);
    });

    it('should check All new products', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkAllNewProductsLink', baseContext);

      await foDefaultHomePage.goToAllProductsPage(page, 'ps-newproducts');

      const pageTitle = await foDefaultNewProductsPage.getPageTitle(page);
      expect(pageTitle).to.equal(foDefaultNewProductsPage.pageTitle);
    });
  });
});
