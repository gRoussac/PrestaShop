import testContext from '@utils/testContext';
import {expect} from 'chai';

import {deleteCustomerTest} from '@commonTests/BO/customers/customer';

import {
  foDefaultCreateAccountPage,
  foDefaultHomePage,
  foDefaultLoginPage,
} from '@utils/foDefaultPages';

import {
  type BrowserContext,
  FakerCustomer,
  type Page,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_FO_default_login_createAccount';

describe('FO - Login : Create account', async () => {
  let browserContext: BrowserContext;
  let page: Page;

  const customerData: FakerCustomer = new FakerCustomer();

  // before and after functions
  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  describe('Create account', () => {
    it('should open the shop page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToShopFO', baseContext);

      await foDefaultHomePage.goTo(page, global.FO.URL);

      const result = await foDefaultHomePage.isHomePage(page);
      expect(result).to.eq(true);
    });

    it('should go to login page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToLoginPage', baseContext);

      await foDefaultHomePage.goToLoginPage(page);

      const pageTitle = await foDefaultLoginPage.getPageTitle(page);
      expect(pageTitle).to.equal(foDefaultLoginPage.pageTitle);
    });

    it('should go to create account page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToCreateAccountPage', baseContext);

      await foDefaultLoginPage.goToCreateAccountPage(page);

      const pageHeaderTitle = await foDefaultCreateAccountPage.getHeaderTitle(page);
      expect(pageHeaderTitle).to.equal(foDefaultCreateAccountPage.formTitle);
    });

    it('should create new account', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'createAccount', baseContext);

      await foDefaultCreateAccountPage.createAccount(page, customerData);

      const isCustomerConnected = await foDefaultHomePage.isCustomerConnected(page);
      expect(isCustomerConnected, 'Created customer is not connected!').to.eq(true);
    });

    it('should check if the page is redirected to home page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'isHomePage', baseContext);

      const isHomePage = await foDefaultHomePage.isHomePage(page);
      expect(isHomePage, 'Fail to redirect to FO home page!').to.eq(true);
    });

    it('should sign out from FO', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'signOutFO', baseContext);

      await foDefaultHomePage.logout(page);

      const isCustomerConnected = await foDefaultHomePage.isCustomerConnected(page);
      expect(isCustomerConnected, 'Customer is connected!').to.eq(false);
    });
  });

  // Post-condition: Delete created customer account from BO
  deleteCustomerTest(customerData, `${baseContext}_postTest_1`);
});
