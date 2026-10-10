import testContext from '@utils/testContext';
import {expect} from 'chai';

import {
  foDefaultCreateAccountPage,
  foDefaultHomePage,
  foDefaultLoginPage,
  foDefaultMyAccountPage,
  foDefaultMyAddressesCreatePage,
  foDefaultMyAddressesPage,
} from '@utils/foDefaultPages';

import {
  type BrowserContext,
  FakerAddress,
  FakerCustomer,
  type Page,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

let browserContext: BrowserContext;
let page: Page;

/**
 * Function to create account in FO
 * @param customerData {FakerCustomer} Data to set when creating the account
 * @param baseContext {string} String to identify the test
 */
function createAccountTest(customerData: FakerCustomer, baseContext: string = 'commonTests-createAccountTest'): void {
  describe('PRE-TEST: Create account on FO', async () => {
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

    it('should go to create account page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToCreateAccountPage', baseContext);

      await foDefaultHomePage.goToLoginPage(page);
      await foDefaultLoginPage.goToCreateAccountPage(page);

      const pageHeaderTitle = await foDefaultCreateAccountPage.getHeaderTitle(page);
      expect(pageHeaderTitle).to.equal(foDefaultCreateAccountPage.formTitle);
    });

    it('should create new account', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'createAccount', baseContext);

      await foDefaultCreateAccountPage.createAccount(page, customerData);

      const isCustomerConnected = await foDefaultHomePage.isCustomerConnected(page);
      expect(isCustomerConnected).to.eq(true);
    });

    it('should sign out from FO', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'signOutFO', baseContext);

      await foDefaultCreateAccountPage.goToHomePage(page);
      await foDefaultHomePage.logout(page);

      const isCustomerConnected = await foDefaultHomePage.isCustomerConnected(page);
      expect(isCustomerConnected, 'Customer is connected').to.eq(false);
    });
  });
}

function createAddressTest(
  customerLoginData: FakerCustomer,
  addressData: FakerAddress,
  baseContext: string = 'commonTests-createAddressTest',
): void {
  describe('PRE-TEST: Create address on FO', async () => {
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

    it('should sign in with default customer', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'signInFO', baseContext);

      await foDefaultLoginPage.customerLogin(page, customerLoginData);
      const isCustomerConnected = await foDefaultLoginPage.isCustomerConnected(page);
      expect(isCustomerConnected, 'Customer is not connected').to.eq(true);
    });

    it('should go to \'My account\' page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToAccountPage', baseContext);

      await foDefaultHomePage.goToMyAccountPage(page);

      const pageTitle = await foDefaultMyAccountPage.getPageTitle(page);
      expect(pageTitle).to.equal(foDefaultMyAccountPage.pageTitle);
    });

    it('should go to \'Addresses\' page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goTofoDefaultMyAddressesPage', baseContext);

      await foDefaultMyAccountPage.goToAddressesPage(page);

      const pageHeaderTitle = await foDefaultMyAddressesPage.getPageTitle(page);
      expect(pageHeaderTitle).to.include(foDefaultMyAddressesPage.addressPageTitle);
    });

    it('should go to create address page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToNewAddressPage', baseContext);

      await foDefaultMyAddressesPage.openNewAddressForm(page);

      const pageHeaderTitle = await foDefaultMyAddressesCreatePage.getHeaderTitle(page);
      expect(pageHeaderTitle).to.equal(foDefaultMyAddressesCreatePage.creationFormTitle);
    });

    it('should create address', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'createAddress', baseContext);

      const textResult = await foDefaultMyAddressesCreatePage.setAddress(page, addressData);
      expect(textResult).to.equal(foDefaultMyAddressesPage.addAddressSuccessfulMessage);
    });

    it('should sign out from FO', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'signOutFO', baseContext);

      await foDefaultMyAddressesCreatePage.goToHomePage(page);
      await foDefaultHomePage.logout(page);

      const isCustomerConnected = await foDefaultHomePage.isCustomerConnected(page);
      expect(isCustomerConnected, 'Customer is connected').to.eq(false);
    });
  });
}

export {createAccountTest, createAddressTest};
