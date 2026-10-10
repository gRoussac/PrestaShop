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

const baseContext: string = 'functional_FO_default_cart_cart_changeQuantity';
/*
Scenario:
- Go to Fo and add the first product to cart
- Increase/Decrease the product quantity by the touchSpin up/down
- Edit product quantity bu the input (3, -6, +6, 64, 'azerty', 2400, 0)
*/
describe('FO - Cart : Change quantity', async () => {
  let browserContext: BrowserContext;
  let page: Page;

  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  describe('Change quantity', async () => {
    it('should go to FO', async function () {
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

    it('should increase the product quantity by the touchSpin up to 5', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'increaseQuantity5', baseContext);

      const quantity = await foDefaultCartPage.setProductQuantity(page, 1, 5);
      expect(quantity).to.equal(5);

      const notificationsNumber = await foDefaultCartPage.getCartNotificationsNumber(page);
      expect(notificationsNumber).to.be.equal(5);
    });

    it('should decrease the product quantity by the touchSpin down to 2', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'decreaseQuantity2', baseContext);

      const quantity = await foDefaultCartPage.setProductQuantity(page, 1, 2);
      expect(quantity).to.equal(2);

      const notificationsNumber = await foDefaultCartPage.getCartNotificationsNumber(page);
      expect(notificationsNumber).to.be.equal(2);
    });

    it('should set the quantity 3 in the input', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'setQuantity3', baseContext);

      await foDefaultCartPage.editProductQuantity(page, 1, 3);

      const notificationsNumber = await foDefaultCartPage.getCartNotificationsNumber(page);
      expect(notificationsNumber).to.be.equal(3);
    });

    it('should set the quantity -6 in the input', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'setQuantity-6', baseContext);

      await foDefaultCartPage.deleteProduct(page, 1);

      const notificationsNumber = await foDefaultCartPage.getCartNotificationsNumber(page);
      expect(notificationsNumber).to.be.equal(0);
    });

    it('should go to home page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToHomePage2', baseContext);

      await foDefaultCartPage.goToHomePage(page);

      const isHomePage = await foDefaultHomePage.isHomePage(page);
      expect(isHomePage).to.equal(true);
    });

    it('should add the first product to cart and proceed to checkout', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addFirstProductToCart2', baseContext);

      await foDefaultHomePage.quickViewProduct(page, 1);
      await foDefaultModalQuickViewPage.addToCartByQuickView(page);
      await foDefaultModalBlockCartPage.proceedToCheckout(page);

      const pageTitle = await foDefaultCartPage.getPageTitle(page);
      expect(pageTitle).to.equal(foDefaultCartPage.pageTitle);
    });

    it('should set the quantity +6 in the input', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'setQuantity+6', baseContext);

      await foDefaultCartPage.editProductQuantity(page, 1, +6);

      const notificationsNumber = await foDefaultCartPage.getCartNotificationsNumber(page);
      expect(notificationsNumber).to.be.equal(6);
    });

    it('should set the quantity 64 in the input', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'setQuantity64', baseContext);

      await foDefaultCartPage.editProductQuantity(page, 1, 64);

      const notificationsNumber = await foDefaultCartPage.getCartNotificationsNumber(page);
      expect(notificationsNumber).to.be.equal(64);
    });

    it('should set the quantity 2400 in the input & check the error message', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'setQuantity2400', baseContext);

      await foDefaultCartPage.editProductQuantity(page, 1, 2400);

      const alertText = await foDefaultCartPage.getNotificationMessage(page);
      expect(alertText).to.contains(foDefaultCartPage.errorNotificationForProductQuantity(300));

      const notificationsNumber = await foDefaultCartPage.getCartNotificationsNumber(page);
      expect(notificationsNumber).to.be.equal(300);
    });

    it('should set the quantity 3 in the input without validation', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'setQuantityWithoutValidation', baseContext);

      await foDefaultCartPage.setQuantity(page, 1, 3);

      const notificationsNumber = await foDefaultCartPage.getCartNotificationsNumber(page);
      expect(notificationsNumber).to.be.equal(300);
    });

    it('should set the quantity 0 in the input', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'setQuantity', baseContext);

      await foDefaultCartPage.editProductQuantity(page, 1, 0);

      const notificationsNumber = await foDefaultCartPage.getCartNotificationsNumber(page);
      expect(notificationsNumber).to.be.equal(1);
    });
  });
});
