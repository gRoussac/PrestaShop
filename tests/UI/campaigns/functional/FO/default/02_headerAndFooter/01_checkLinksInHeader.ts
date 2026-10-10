import testContext from '@utils/testContext';
import {expect} from 'chai';

import {
  foDefaultCartPage,
  foDefaultContactUsPage,
  foDefaultHomePage,
  foDefaultLoginPage,
  foDefaultModalBlockCartPage,
  foDefaultModalQuickViewPage,
  foDefaultMyAccountPage,
} from '@utils/foDefaultPages';

import {
  type BrowserContext,
  dataCustomers,
  type Page,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_FO_default_headerAndFooter_checkLinksInHeader';

/*
Go to FO
Check header links:
- Contact us
- Sign in
- My account( Customer name)
- Cart
- Sign out
- Logo
 */
describe('FO - Header and Footer : Check links in header page', async () => {
  let browserContext: BrowserContext;
  let page: Page;

  describe('Check links in header page', async () => {
    before(async function () {
      browserContext = await utilsPlaywright.createBrowserContext(this.browser);
      page = await utilsPlaywright.newTab(browserContext);
    });

    after(async () => {
      await utilsPlaywright.closeBrowserContext(browserContext);
    });

    it('should go to FO home page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToFO', baseContext);

      await foDefaultHomePage.goToFo(page);

      const isHomePage = await foDefaultHomePage.isHomePage(page);
      expect(isHomePage).to.eq(true);
    });

    it('should check \'Contact us\' header link', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkContactUsHeaderLink', baseContext);

      // Check Contact us
      await foDefaultHomePage.clickOnHeaderLink(page, 'Contact us');

      const pageTitle = await foDefaultContactUsPage.getPageTitle(page);
      expect(pageTitle).to.contains(foDefaultContactUsPage.pageTitle);
    });

    it('should check \'sign in\' link', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkSignInLink', baseContext);

      // Check sign in link
      await foDefaultHomePage.clickOnHeaderLink(page, 'Sign in');

      const pageTitle = await foDefaultLoginPage.getPageTitle(page);
      expect(pageTitle).to.equal(foDefaultLoginPage.pageTitle);
    });

    it('should sign in by default customer', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'signInFO', baseContext);

      // Sign in
      await foDefaultLoginPage.customerLogin(page, dataCustomers.johnDoe);

      const isCustomerConnected = await foDefaultLoginPage.isCustomerConnected(page);
      expect(isCustomerConnected, 'Customer is not connected!').to.eq(true);
    });

    it('should check my account link', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkMyAccountLink', baseContext);

      await foDefaultLoginPage.goToMyAccountPage(page);

      const pageTitle = await foDefaultMyAccountPage.getPageTitle(page);
      expect(pageTitle).to.equal(foDefaultMyAccountPage.pageTitle);
    });

    it('should add a product to cart by quick view', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addProductToCart', baseContext);

      await foDefaultLoginPage.goToHomePage(page);
      // Add product to cart by quick view
      await foDefaultHomePage.quickViewProduct(page, 1);
      await foDefaultModalQuickViewPage.setQuantityAndAddToCart(page, 3);

      // Close block cart modal
      const isQuickViewModalClosed = await foDefaultModalBlockCartPage.closeBlockCartModal(page);
      expect(isQuickViewModalClosed).to.eq(true);
    });

    it('should check \'Cart\' link', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkShoppingCartLink', baseContext);

      // Check cart link
      await foDefaultHomePage.clickOnHeaderLink(page, 'Cart');

      const pageTitle = await foDefaultCartPage.getPageTitle(page);
      expect(pageTitle).to.equal(foDefaultCartPage.pageTitle);
    });

    it('should go to home page and check the notification number', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkNotificationNumber1', baseContext);

      await foDefaultLoginPage.goToHomePage(page);

      const notificationsNumber = await foDefaultHomePage.getCartNotificationsNumber(page);
      expect(notificationsNumber, 'Notification number is not equal to 3!').to.be.equal(3);
    });

    it('should check \'Sign out\' link', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkSignOutLink', baseContext);

      // Sign out
      await foDefaultHomePage.logout(page);

      const isCustomerConnected = await foDefaultHomePage.isCustomerConnected(page);
      expect(isCustomerConnected, 'Customer is connected!').to.eq(false);
    });

    it('should check that the cart is empty', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkNotificationNumber2', baseContext);

      const notificationsNumber = await foDefaultHomePage.getCartNotificationsNumber(page);
      expect(notificationsNumber, 'The cart is not empty!').to.be.equal(0);
    });

    it('should check \'Logo\' link', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkLogoLink', baseContext);

      await foDefaultHomePage.clickOnHeaderLink(page, 'Logo', false);

      const pageTitle = await foDefaultHomePage.getPageTitle(page);
      expect(pageTitle).to.equal(foDefaultHomePage.pageTitle);
    });
  });
});
