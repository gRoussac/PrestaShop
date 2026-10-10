import testContext from '@utils/testContext';
import {expect} from 'chai';

import {
  foDefaultHomePage,
  foDefaultModalBlockCartPage,
  foDefaultModalQuickViewPage,
  foDefaultSearchResultsPage,
} from '@utils/foDefaultPages';

import {
  type BrowserContext,
  dataProducts,
  type Page,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_FO_default_menuAndNavigation_navigationAndDisplay_quickViewProducts';

/*
Scenario:
Go to FO > quick view the product demo_3 and check information
quick view the product demo_12 and check information
quick view the product demo_14 and check information
 */
describe('FO - Menu and Navigation - Navigate and display : Quickview of product', async () => {
  let browserContext: BrowserContext;
  let page: Page;

  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  describe(`Quick view the product '${dataProducts.demo_3.name}'`, async () => {
    it('should open the shop page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToShopFO', baseContext);

      await foDefaultHomePage.goTo(page, global.FO.URL);

      const result = await foDefaultHomePage.isHomePage(page);
      expect(result).to.equal(true);
    });

    it(`should search for the product '${dataProducts.demo_3.name}'`, async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'searchProduct1', baseContext);

      await foDefaultHomePage.searchProduct(page, dataProducts.demo_3.name);

      const pageTitle = await foDefaultSearchResultsPage.getPageTitle(page);
      expect(pageTitle).to.equal(foDefaultSearchResultsPage.pageTitle);
    });

    it(`should quick view the product '${dataProducts.demo_3.name}'`, async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'quickViewProduct1', baseContext);

      await foDefaultSearchResultsPage.quickViewProduct(page, 1);

      const isModalVisible = await foDefaultModalQuickViewPage.isQuickViewProductModalVisible(page);
      expect(isModalVisible).to.equal(true);
    });

    it('should check product information', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkProductInformation1', baseContext);

      const result = await foDefaultModalQuickViewPage.getProductDetailsFromQuickViewModal(page);
      await Promise.all([
        expect(result.name).to.equal(dataProducts.demo_3.name),
        expect(result.price).to.equal(dataProducts.demo_3.finalPrice),
        expect(result.taxShippingDeliveryLabel).to.equal('Tax included'),
        expect(result.shortDescription).to.equal(dataProducts.demo_3.summary),
        expect(result.coverImage).to.contains(dataProducts.demo_3.coverImage),
        expect(result.thumbImage).to.contains(dataProducts.demo_3.thumbImage),
      ]);
    });

    it('should add product to cart and check that the block cart modal is visible', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'clickOnContinueShopping', baseContext);

      await foDefaultModalQuickViewPage.addToCartByQuickView(page);

      const isVisible = await foDefaultModalBlockCartPage.isBlockCartModalVisible(page);
      expect(isVisible).to.equal(true);
    });

    it('should click on continue shopping button', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'continueShopping', baseContext);

      const isModalNotVisible = await foDefaultModalBlockCartPage.continueShopping(page);
      expect(isModalNotVisible).to.equal(true);
    });
  });

  describe(`Quick view the product '${dataProducts.demo_12.name}'`, async () => {
    it(`should search for the product '${dataProducts.demo_12.name}'`, async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'searchProduct2', baseContext);

      await foDefaultHomePage.searchProduct(page, dataProducts.demo_12.name);

      const pageTitle = await foDefaultSearchResultsPage.getPageTitle(page);
      expect(pageTitle).to.equal(foDefaultSearchResultsPage.pageTitle);
    });

    it(`should quick view the product '${dataProducts.demo_12.name}'`, async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'quickViewProduct2', baseContext);

      await foDefaultSearchResultsPage.quickViewProduct(page, 1);

      const isModalVisible = await foDefaultModalQuickViewPage.isQuickViewProductModalVisible(page);
      expect(isModalVisible).to.equal(true);
    });

    it('should check product information', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkProductInformation2', baseContext);

      const result = await foDefaultModalQuickViewPage.getProductDetailsFromQuickViewModal(page);
      await Promise.all([
        expect(result.name).to.equal(dataProducts.demo_12.name),
        expect(result.price).to.equal(dataProducts.demo_12.price),
        expect(result.taxShippingDeliveryLabel).to.equal('Tax included'),
        expect(result.shortDescription).to.equal(dataProducts.demo_12.summary),
        expect(result.coverImage).to.contains(dataProducts.demo_12.coverImage),
        expect(result.thumbImage).to.contains(dataProducts.demo_12.thumbImage),
      ]);
    });

    it('should close the modal', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'closeModal1', baseContext);

      const isQuickViewModalClosed = await foDefaultModalQuickViewPage.closeQuickViewModal(page);
      expect(isQuickViewModalClosed).to.equal(true);
    });
  });

  describe(`Quick view the product '${dataProducts.demo_14.name}'`, async () => {
    it(`should search for the product '${dataProducts.demo_12.name}'`, async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'searchProduct3', baseContext);

      await foDefaultHomePage.searchProduct(page, dataProducts.demo_14.name);

      const pageTitle = await foDefaultSearchResultsPage.getPageTitle(page);
      expect(pageTitle).to.equal(foDefaultSearchResultsPage.pageTitle);
    });

    it(`should quick view the product '${dataProducts.demo_14.name}'`, async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'quickViewProduct3', baseContext);

      await foDefaultSearchResultsPage.quickViewProduct(page, 1);

      const isModalVisible = await foDefaultModalQuickViewPage.isQuickViewProductModalVisible(page);
      expect(isModalVisible).to.equal(true);
    });

    it('should check product information', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkProductInformation3', baseContext);

      const result = await foDefaultModalQuickViewPage.getProductDetailsFromQuickViewModal(page);
      await Promise.all([
        expect(result.name).to.equal(dataProducts.demo_14.name),
        expect(result.price).to.equal(dataProducts.demo_14.price),
        expect(result.taxShippingDeliveryLabel).to.equal('Tax included'),
        expect(result.shortDescription).to.equal(dataProducts.demo_14.summary),
        expect(result.coverImage).to.contains(dataProducts.demo_14.coverImage),
        expect(result.thumbImage).to.contains(dataProducts.demo_14.thumbImage),
      ]);
    });

    it('should check that \'Add to cart\' button is disabled', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkAddToCartButton', baseContext);

      const isEnabled = await foDefaultModalQuickViewPage.isAddToCartButtonEnabled(page);
      expect(isEnabled, 'Add to cart button is not disabled').to.equal(false);
    });

    it('should close the modal', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'closeModal2', baseContext);

      const isQuickViewModalClosed = await foDefaultModalQuickViewPage.closeQuickViewModal(page, true);
      expect(isQuickViewModalClosed).to.equal(true);
    });
  });
});
