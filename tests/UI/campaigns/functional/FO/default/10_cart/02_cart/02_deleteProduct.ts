import testContext from '@utils/testContext';
import {expect} from 'chai';

import {
  foDefaultCartPage,
  foDefaultHomePage,
  foDefaultModalBlockCartPage,
  foDefaultModalQuickViewPage,
} from '@utils/foDefaultPages';

import {
  type BrowserContext,
  type Page,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_FO_default_cart_cart_deleteProduct';

describe('FO - Cart : Delete product', async () => {
  let browserContext: BrowserContext;
  let page: Page;

  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  describe('Delete product in cart page', async () => {
    it('should open the shop page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToFo', baseContext);

      await foDefaultHomePage.goToFo(page);
      await foDefaultHomePage.changeLanguage(page, 'en');

      const isHomePage = await foDefaultHomePage.isHomePage(page);
      expect(isHomePage).to.equal(true);
    });

    it('should add the first product to cart and proceed to checkout', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addFirstProductToCart', baseContext);

      await foDefaultHomePage.quickViewProduct(page, 1);
      await foDefaultModalQuickViewPage.addToCartByQuickView(page);
      await foDefaultModalBlockCartPage.proceedToCheckout(page);

      const pageTitle = await foDefaultCartPage.getPageTitle(page);
      expect(pageTitle).to.equal(foDefaultCartPage.pageTitle);
    });

    it('should click on remove product link', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'removeProduct', baseContext);

      await foDefaultCartPage.deleteProduct(page, 1);

      const notificationNumber = await foDefaultCartPage.getCartNotificationsNumber(page);
      expect(notificationNumber).to.equal(0);
    });

    it('should check the message "There are no more items in your cart"', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkNoItemMessage', baseContext);

      const message = await foDefaultCartPage.getNoItemsInYourCartMessage(page);
      expect(message).to.equal(foDefaultCartPage.noItemsInYourCartMessage);
    });

    it('should go to home page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToHomePage', baseContext);

      await foDefaultCartPage.goToHomePage(page);

      const result = await foDefaultHomePage.isHomePage(page);
      expect(result).to.equal(true);
    });

    it('should add the first product to cart and proceed to checkout', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addFirstProductToCart1', baseContext);

      await foDefaultHomePage.quickViewProduct(page, 1);
      await foDefaultModalQuickViewPage.addToCartByQuickView(page);
      await foDefaultModalBlockCartPage.proceedToCheckout(page);

      const pageTitle = await foDefaultCartPage.getPageTitle(page);
      expect(pageTitle).to.equal(foDefaultCartPage.pageTitle);
    });

    it('should set the quantity 0 by the touchSpin', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'setQuantity0ByTouchSpin', baseContext);

      await foDefaultCartPage.setProductQuantity(page, 1, 0);

      const notificationsNumber = await foDefaultCartPage.getCartNotificationsNumber(page);
      expect(notificationsNumber).to.equal(0);
    });

    it('should check the message "There are no more items in your cart"', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkNoItemMessage2', baseContext);

      const message = await foDefaultCartPage.getNoItemsInYourCartMessage(page);
      expect(message).to.equal(foDefaultCartPage.noItemsInYourCartMessage);
    });

    it('should go to home page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToHomePage2', baseContext);

      await foDefaultCartPage.goToHomePage(page);

      const result = await foDefaultHomePage.isHomePage(page);
      expect(result).to.equal(true);
    });

    it('should add the first product to cart and proceed to checkout', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addFirstProductToCart3', baseContext);

      await foDefaultHomePage.quickViewProduct(page, 1);
      await foDefaultModalQuickViewPage.addToCartByQuickView(page);
      await foDefaultModalBlockCartPage.proceedToCheckout(page);

      const pageTitle = await foDefaultCartPage.getPageTitle(page);
      expect(pageTitle).to.equal(foDefaultCartPage.pageTitle);
    });

    it('should set the quantity 0 in the input', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'setQuantity0', baseContext);

      await foDefaultCartPage.deleteProduct(page, 1);

      const notificationsNumber = await foDefaultCartPage.getCartNotificationsNumber(page);
      expect(notificationsNumber).to.equal(0);
    });

    it('should check the message "There are no more items in your cart"', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkNoItemMessage3', baseContext);

      const message = await foDefaultCartPage.getNoItemsInYourCartMessage(page);
      expect(message).to.equal(foDefaultCartPage.noItemsInYourCartMessage);
    });
  });
});
