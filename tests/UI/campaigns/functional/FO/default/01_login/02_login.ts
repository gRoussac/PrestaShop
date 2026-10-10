// Import utils
import testContext from '@utils/testContext';

import {
  foDefaultHomePage,
  foDefaultLoginPage,
} from '@utils/foDefaultPages';

import {
  type BrowserContext,
  dataCustomers,
  FakerCustomer,
  type Page,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

import {expect} from 'chai';

const baseContext: string = 'functional_FO_default_login_login';

describe('FO - Login : Login in FO', async () => {
  let browserContext: BrowserContext;
  let page: Page;

  const firstCredentialsData: FakerCustomer = new FakerCustomer();
  const secondCredentialsData: FakerCustomer = new FakerCustomer({password: dataCustomers.johnDoe.password});
  const thirdCredentialsData: FakerCustomer = new FakerCustomer({email: dataCustomers.johnDoe.email});

  // before and after functions
  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  describe('Login in FO', () => {
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

    it('should enter an invalid credentials', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'enterInvalidCredentials', baseContext);

      await foDefaultLoginPage.customerLogin(page, firstCredentialsData, false);

      const loginError = await foDefaultLoginPage.getLoginError(page);
      expect(loginError).to.contains(foDefaultLoginPage.loginErrorText);
    });

    it('should enter an invalid email', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'enterInvalidEmail', baseContext);

      await foDefaultLoginPage.customerLogin(page, secondCredentialsData, false);

      const loginError = await foDefaultLoginPage.getLoginError(page);
      expect(loginError).to.contains(foDefaultLoginPage.loginErrorText);
    });

    it('should enter an invalid password', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'enterInvalidPassword', baseContext);

      await foDefaultLoginPage.customerLogin(page, thirdCredentialsData, false);

      const loginError = await foDefaultLoginPage.getLoginError(page);
      expect(loginError).to.contains(foDefaultLoginPage.loginErrorText);
    });

    it('should check password type', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkPasswordType', baseContext);

      const inputType = await foDefaultLoginPage.getPasswordType(page);
      expect(inputType).to.equal('password');
    });

    it('should click on show button and check the password', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'clickOnShowButton', baseContext);

      const inputType = await foDefaultLoginPage.showPassword(page);
      expect(inputType).to.equal('text');
    });

    it('should enter a valid credentials', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'enterValidCredentials', baseContext);

      await foDefaultLoginPage.customerLogin(page, dataCustomers.johnDoe);

      const isCustomerConnected = await foDefaultLoginPage.isCustomerConnected(page);
      expect(isCustomerConnected, 'Customer is not connected!').to.eq(true);

      const result = await foDefaultHomePage.isHomePage(page);
      expect(result).to.eq(true);
    });
  });
});
