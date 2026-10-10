import testContext from '@utils/testContext';
import {expect} from 'chai';

import {
  foDefaultCartPage,
  foDefaultHomePage,
  foDefaultModalBlockCartPage,
  foDefaultModalQuickViewPage,
  foDefaultProductPage,
  foDefaultSearchResultsPage,
} from '@utils/foDefaultPages';

import {
  type BrowserContext,
  dataProducts,
  type Page,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_FO_default_productPage_productPage_addToCart';

describe('FO - Product page - Product page : Add to cart', async () => {
  let browserContext: BrowserContext;
  let page: Page;

  const qtyProductPage: number = 5;
  const qtyQuickView: number = 100;
  const qtyQuickAdd: number = 1;

  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  describe('Add to cart', async () => {
    it('should go to FO home page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToFoToCreateAccount', baseContext);

      await foDefaultHomePage.goToFo(page);

      const isHomePage = await foDefaultHomePage.isHomePage(page);
      expect(isHomePage).to.eq(true);
    });

    it(`should search the product "${dataProducts.demo_12.name}"`, async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'searchDemo12', baseContext);

      await foDefaultHomePage.searchProduct(page, dataProducts.demo_12.name);

      const pageTitle = await foDefaultSearchResultsPage.getPageTitle(page);
      expect(pageTitle).to.equal(foDefaultSearchResultsPage.pageTitle);
    });

    it('should go to the product page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToProductPageDemo12', baseContext);

      await foDefaultSearchResultsPage.goToProductPage(page, 1);

      const pageTitle = await foDefaultProductPage.getPageTitle(page);
      expect(pageTitle).to.contains(dataProducts.demo_12.name);
    });

    it('should add the product to cart', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addProductToCart', baseContext);

      await foDefaultProductPage.addProductToTheCart(page, qtyProductPage, [], null);

      const productDetails = await foDefaultModalBlockCartPage.getProductDetailsFromBlockCartModal(page);
      expect(productDetails.quantity).to.be.equal(qtyProductPage);
      expect(productDetails.name).to.be.equal(dataProducts.demo_12.name);
    });

    it('should close the cart modal', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'closeCartModal', baseContext);

      const isModalClosed = await foDefaultModalBlockCartPage.closeBlockCartModal(page);
      expect(isModalClosed).to.be.equal(true);
    });

    it('should return to the home page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'searchDemo6', baseContext);

      await foDefaultProductPage.goToHomePage(page);

      const isHomePage = await foDefaultHomePage.isHomePage(page);
      expect(isHomePage).to.eq(true);
    });

    it('should add product to cart by quick view', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addProductToCartByQuickView', baseContext);

      await foDefaultHomePage.quickViewProduct(page, 1);
      await foDefaultModalQuickViewPage.setQuantity(page, qtyQuickView);
      await foDefaultModalQuickViewPage.addToCartByQuickView(page);

      const productDetails = await foDefaultModalBlockCartPage.getProductDetailsFromBlockCartModal(page);
      expect(productDetails.quantity).to.be.equal(qtyQuickView);
      expect(productDetails.name).to.be.equal(dataProducts.demo_1.name);
    });

    it('should close the cart modal from quickview', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'closeCartModalQuickview', baseContext);

      const isModalClosed = await foDefaultModalBlockCartPage.closeBlockCartModal(page);
      expect(isModalClosed).to.be.equal(true);
    });

    it('should add product to cart by quick add', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addProductToCartByQuickAdd', baseContext);

      await foDefaultHomePage.addProductToCart(page, 1);

      const productDetails = await foDefaultModalBlockCartPage.getProductDetailsFromBlockCartModal(page);
      expect(productDetails.quantity).to.be.equal(qtyQuickView + qtyQuickAdd);
      expect(productDetails.name).to.be.equal(dataProducts.demo_1.name);
    });

    it('should proceed to checkout', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'proceedToCheckout', baseContext);

      await foDefaultModalBlockCartPage.proceedToCheckout(page);

      const pageTitle = await foDefaultCartPage.getPageTitle(page);
      expect(pageTitle).to.eq(foDefaultCartPage.pageTitle);
    });

    it('should remove products', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'removeProducts', baseContext);

      await foDefaultCartPage.deleteProduct(page, 2);
      await foDefaultCartPage.deleteProduct(page, 1);

      const productCount = await foDefaultCartPage.getProductsNumber(page);
      expect(productCount).to.eq(0);
    });
  });
});
