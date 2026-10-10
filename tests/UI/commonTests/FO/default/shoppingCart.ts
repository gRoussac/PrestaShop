// Import utils
import testContext from '@utils/testContext';

import {expect} from 'chai';
import {
  foDefaultCartPage,
  foDefaultHomePage,
  foDefaultLoginPage,
  foDefaultProductPage,
  foDefaultSearchResultsPage,
} from '@utils/foDefaultPages';

import {
  type BrowserContext,
  FakerOrder,
  type Page,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

/**
 * Function to Create a non-ordered shopping cart connected in the FO
 * @param orderData {FakerOrder} Data to set when creating the order
 * @param baseContext {string} String to identify the test
 */
function createShoppingCart(orderData: FakerOrder, baseContext: string = 'commonTests-createShoppingCart'): void {
  let browserContext: BrowserContext;
  let page: Page;

  describe('PRE-TEST: Create a non-ordered shopping cart being connected in the FO', async () => {
    // before and after functions
    before(async function () {
      browserContext = await utilsPlaywright.createBrowserContext(this.browser);
      page = await utilsPlaywright.newTab(browserContext);
    });

    after(async () => {
      await utilsPlaywright.closeBrowserContext(browserContext);
    });

    it('should open FO page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'openFO', baseContext);

      // Go to FO and change language
      await foDefaultHomePage.goToFo(page);
      await foDefaultHomePage.changeLanguage(page, 'en');

      const isHomePage = await foDefaultHomePage.isHomePage(page);
      expect(isHomePage).to.eq(true);
    });

    it('should go to login page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToLoginPageFO', baseContext);

      await foDefaultHomePage.goToLoginPage(page);

      const pageTitle = await foDefaultLoginPage.getPageTitle(page);
      expect(pageTitle).to.contains(foDefaultLoginPage.pageTitle);
    });

    it('should sign in with customer', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'signInFO', baseContext);

      await foDefaultLoginPage.customerLogin(page, orderData.customer);

      const isCustomerConnected = await foDefaultLoginPage.isCustomerConnected(page);
      expect(isCustomerConnected, 'Customer is not connected').to.eq(true);
    });

    it(`should search for the product ${orderData.products[0].product.name}`, async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'searchForProduct', baseContext);

      await foDefaultHomePage.searchProduct(page, orderData.products[0].product.name);

      const pageTitle = await foDefaultSearchResultsPage.getPageTitle(page);
      expect(pageTitle).to.equal(foDefaultSearchResultsPage.pageTitle);
    });

    it('should add product to cart', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addProductToCart', baseContext);

      await foDefaultSearchResultsPage.goToProductPage(page, 1);
      // Add the product to the cart
      await foDefaultProductPage.addProductToTheCart(page, orderData.products[0].quantity);

      const notificationsNumber = await foDefaultCartPage.getCartNotificationsNumber(page);
      expect(notificationsNumber).to.be.equal(orderData.products[0].quantity);
    });

    it('should sign out from FO', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'signOutFo', baseContext);

      await foDefaultHomePage.logout(page);

      const isCustomerConnected = await foDefaultHomePage.isCustomerConnected(page);
      expect(isCustomerConnected, 'Customer is connected').to.eq(false);

      const notificationNumber = await foDefaultHomePage.getCartNotificationsNumber(page);
      expect(notificationNumber).to.be.equal(0);
    });
  });
}

export default createShoppingCart;
