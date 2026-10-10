import testContext from '@utils/testContext';
import {expect} from 'chai';

import {
  foDefaultCartPage,
  foDefaultHomePage,
  foDefaultModalBlockCartPage,
  foDefaultModalQuickViewPage,
  foDefaultProductPage,
} from '@utils/foDefaultPages';

import {
  type BrowserContext,
  type Page,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_FO_default_cart_modal_continueShopping';

describe('FO - Cart - Modal : Continue shopping / Proceed to checkout / Close', async () => {
  let browserContext: BrowserContext;
  let page: Page;

  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  describe('Continue shopping / Proceed to checkout / Close modal', async () => {
    it('should open the shop page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToFo', baseContext);

      await foDefaultHomePage.goToFo(page);
      await foDefaultHomePage.changeLanguage(page, 'en');

      const isHomePage = await foDefaultHomePage.isHomePage(page);
      expect(isHomePage).to.eq(true);
    });

    it('should add the first product to cart by quick view', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addFirstProductToCart', baseContext);

      await foDefaultHomePage.quickViewProduct(page, 1);
      await foDefaultModalQuickViewPage.setQuantityAndAddToCart(page, 2);

      const isBlockCartModal = await foDefaultModalBlockCartPage.isBlockCartModalVisible(page);
      expect(isBlockCartModal).to.equal(true);

      const successMessage = await foDefaultModalBlockCartPage.getBlockCartModalTitle(page);
      expect(successMessage).to.contains(foDefaultHomePage.successAddToCartMessage);
    });

    it('should click on continue shopping button', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'continueShopping', baseContext);

      const isModalNotVisible = await foDefaultModalBlockCartPage.continueShopping(page);
      expect(isModalNotVisible).to.equal(true);
    });

    it('should go to the second product page and add the product to the cart', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToSecondProductPage', baseContext);

      await foDefaultHomePage.goToProductPage(page, 2);
      await foDefaultProductPage.clickOnAddToCartButton(page);

      const successMessage = await foDefaultModalBlockCartPage.getBlockCartModalTitle(page);
      expect(successMessage).to.contains(foDefaultHomePage.successAddToCartMessage);
    });

    it('should close the blockCart modal', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'closeBlockCartModal', baseContext);

      const isQuickViewModalClosed = await foDefaultModalBlockCartPage.closeBlockCartModal(page);
      expect(isQuickViewModalClosed).to.equal(true);
    });

    it('should click on add product to cart button', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addProductToCart', baseContext);

      await foDefaultProductPage.clickOnAddToCartButton(page);

      const successMessage = await foDefaultModalBlockCartPage.getBlockCartModalTitle(page);
      expect(successMessage).to.contains(foDefaultHomePage.successAddToCartMessage);
    });

    it('should close the blockCart modal by clicking outside the modal', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'closeBlockCartModal2', baseContext);

      const isQuickViewModalClosed = await foDefaultModalBlockCartPage.closeBlockCartModal(page, true);
      expect(isQuickViewModalClosed).to.equal(true);
    });

    it('should click on add product to cart button', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addProductToCart2', baseContext);

      await foDefaultProductPage.clickOnAddToCartButton(page);

      const successMessage = await foDefaultModalBlockCartPage.getBlockCartModalTitle(page);
      expect(successMessage).to.contains(foDefaultHomePage.successAddToCartMessage);
    });

    it('should click on proceed to checkout button', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'proceedToCheckout', baseContext);

      await foDefaultModalBlockCartPage.proceedToCheckout(page);

      const notificationsNumber = await foDefaultCartPage.getCartNotificationsNumber(page);
      expect(notificationsNumber).to.equal(5);
    });

    it('should delete the shopping cart', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'deleteProducts', baseContext);

      await foDefaultCartPage.deleteProduct(page, 2);
      await foDefaultCartPage.deleteProduct(page, 1);

      const notificationNumber = await foDefaultCartPage.getCartNotificationsNumber(page);
      expect(notificationNumber).to.be.equal(0);
    });
  });
});
