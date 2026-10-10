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

const baseContext: string = 'functional_FO_default_cart_modal_displayModal';

describe('FO - Cart : Display modal when adding a product to cart', async () => {
  let browserContext: BrowserContext;
  let page: Page;

  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  describe('Display modal when adding a product to cart', async () => {
    it('should open the shop page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToFo', baseContext);

      await foDefaultHomePage.goToFo(page);
      await foDefaultHomePage.changeLanguage(page, 'en');

      const isHomePage = await foDefaultHomePage.isHomePage(page);
      expect(isHomePage).to.equal(true);
    });

    it('should add the first product to cart by quick view and click on continue button', async function () {
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
      // Add the product to the cart
      await foDefaultProductPage.addProductToTheCart(page, 3);

      const pageTitle = await foDefaultCartPage.getPageTitle(page);
      expect(pageTitle).to.equal(foDefaultCartPage.pageTitle);
    });

    it('should check notifications number', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkNotificationsNumber', baseContext);

      const notificationsNumber = await foDefaultHomePage.getCartNotificationsNumber(page);
      expect(notificationsNumber).to.equal(5);
    });
  });
});
