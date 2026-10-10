// Import utils
import testContext from '@utils/testContext';

import {expect} from 'chai';
import {
  foDefaultCategoryPage,
  foDefaultHomePage,
} from '@utils/foDefaultPages';

import {
  type BrowserContext,
  dataCategories,
  type Page,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'sanity_catalogFO_filterProducts';

/*
  Open the FO home page
  Get the product number
  Filter products by a category
  Filter products by a subcategory
 */
describe('FO - Catalog : Filter Products by categories in Home page', async () => {
  let browserContext: BrowserContext;
  let page: Page;
  let allProductsNumber: number = 0;

  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  describe('Catalog FO: Filter products from catalog', async () => {
    it('should open the shop page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToShopFO', baseContext);

      await foDefaultHomePage.goTo(page, global.FO.URL);

      const result = await foDefaultHomePage.isHomePage(page);
      expect(result).to.eq(true);
    });

    it('should check and get the products number', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkNumberOfProducts', baseContext);

      await foDefaultHomePage.goToAllProductsPage(page);

      allProductsNumber = await foDefaultCategoryPage.getProductsNumber(page);
      expect(allProductsNumber).to.be.above(0);
    });

    it('should filter products by the category \'Accessories\' and check result', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'FilterProductByCategory', baseContext);

      await foDefaultCategoryPage.goToCategory(page, dataCategories.accessories.id);

      const pageTitle = await foDefaultCategoryPage.getPageTitle(page);
      expect(pageTitle).to.equal(dataCategories.accessories.name);

      const numberOfProducts = await foDefaultCategoryPage.getProductsNumber(page);
      expect(numberOfProducts).to.be.below(allProductsNumber);
    });

    it('should filter products by the subcategory \'Stationery\' and check result', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'FilterProductBySubCategory', baseContext);

      await foDefaultCategoryPage.reloadPage(page);
      await foDefaultCategoryPage.goToSubCategory(page, dataCategories.accessories.id, dataCategories.stationery.id);

      const numberOfProducts = await foDefaultCategoryPage.getProductsNumber(page);
      expect(numberOfProducts).to.be.below(allProductsNumber);
    });
  });
});
