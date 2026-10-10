// Import utils
import testContext from '@utils/testContext';

import {
  foDefaultCartPage,
  foDefaultCheckoutPage,
  foDefaultHomePage,
  foDefaultProductPage,
} from '@utils/foDefaultPages';

import {
  type BrowserContext,
  dataCustomers,
  FakerCustomer,
  type Page,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

import {expect} from 'chai';

const baseContext: string = 'functional_FO_default_checkout_personalInformation_signIn';

/*
Scenario:
- Open FO page
- Add first product to the cart
- Proceed to checkout and validate the cart
- Enter an invalid credentials
- Login by default customer
- Logout
 */
describe('FO - Checkout - Personal information : Sign in', async () => {
  let browserContext: BrowserContext;
  let page: Page;

  const credentialsData: FakerCustomer = new FakerCustomer();

  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  describe('Sign from Personal information step', async () => {
    it('should open FO page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'openFO', baseContext);

      await foDefaultHomePage.goToFo(page);
      await foDefaultHomePage.changeLanguage(page, 'en');

      const isHomePage = await foDefaultHomePage.isHomePage(page);
      expect(isHomePage).to.eq(true);
    });

    it('should add product to cart', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addProductToCart', baseContext);

      await foDefaultHomePage.goToProductPage(page, 1);
      await foDefaultProductPage.addProductToTheCart(page, 1);

      const pageTitle = await foDefaultCartPage.getPageTitle(page);
      expect(pageTitle).to.equal(foDefaultCartPage.pageTitle);
    });

    it('should proceed to checkout validate the cart', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'validateCart', baseContext);

      await foDefaultCartPage.clickOnProceedToCheckout(page);

      const isCheckoutPage = await foDefaultCheckoutPage.isCheckoutPage(page);
      expect(isCheckoutPage).to.eq(true);
    });

    it('should enter an invalid credentials', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'enterInvalidCredentials', baseContext);

      await foDefaultCheckoutPage.clickOnSignIn(page);

      const isCustomerConnected = await foDefaultCheckoutPage.customerLogin(page, credentialsData);
      expect(isCustomerConnected, 'Customer is connected').to.eq(false);

      const loginError = await foDefaultCheckoutPage.getLoginError(page);
      expect(loginError).to.contains(foDefaultCheckoutPage.authenticationErrorMessage);
    });

    it('should sign in with customer credentials', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'signIn', baseContext);

      const isCustomerConnected = await foDefaultCheckoutPage.customerLogin(page, dataCustomers.johnDoe);
      expect(isCustomerConnected, 'Customer is not connected').to.eq(true);
    });

    it('should click on edit Personal information step and get the identity of the customer', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkCustomerIdentity', baseContext);

      await foDefaultCheckoutPage.clickOnEditPersonalInformationStep(page);

      const customerIdentity = await foDefaultCheckoutPage.getCustomerIdentity(page);
      expect(customerIdentity).to.equal(`${dataCustomers.johnDoe.firstName} ${dataCustomers.johnDoe.lastName}`);
    });

    it('should check the existence of the text message \'If you sign out now, your cart will be emptied.\'', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkMessage', baseContext);

      const message = await foDefaultCheckoutPage.getLogoutMessage(page);
      expect(message).to.equal(foDefaultCheckoutPage.messageIfYouSignOut);
    });

    it('should logout and check that the customer is no longer connected', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'logout', baseContext);

      const isCustomerConnected = await foDefaultCheckoutPage.logOutCustomer(page);
      expect(isCustomerConnected, 'Customer is still connected').to.eq(false);
    });

    it('should check the message \'There are no more items in your cart\' in shopping cart page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkNoItemsNumber', baseContext);

      const message = await foDefaultCartPage.getNoItemsInYourCartMessage(page);
      expect(message).to.equal(foDefaultCartPage.noItemsInYourCartMessage);
    });
  });
});
