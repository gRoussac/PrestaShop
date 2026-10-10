// Import utils
import testContext from '@utils/testContext';

import {
  foDefaultHomePage,
  foDefaultLoginPage,
  foDefaultMyAccountPage,
} from '@utils/foDefaultPages';

import {
  type BrowserContext,
  dataCustomers,
  type Page,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

import {expect} from 'chai';

const baseContext: string = 'functional_FO_default_userAccount_logOut';

describe('FO - User Account : LogOut', async () => {
  let browserContext: BrowserContext;
  let page: Page;

  // before and after functions
  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  describe('Logout in FO', async () => {
    it('should open the shop page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToShopFO', baseContext);

      await foDefaultHomePage.goTo(page, global.FO.URL);

      const result = await foDefaultHomePage.isHomePage(page);
      expect(result).to.eq(true);
    });

    it('should logIn', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'enterValidCredentials', baseContext);

      await foDefaultHomePage.goToLoginPage(page);
      await foDefaultLoginPage.customerLogin(page, dataCustomers.johnDoe);

      const isCustomerConnected = await foDefaultLoginPage.isCustomerConnected(page);
      expect(isCustomerConnected, 'Customer is not connected!').to.eq(true);

      const result = await foDefaultHomePage.isHomePage(page);
      expect(result).to.eq(true);
    });

    it('should go to my account page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToAccountPage', baseContext);

      await foDefaultHomePage.goToMyAccountPage(page);

      const pageTitle = await foDefaultMyAccountPage.getPageTitle(page);
      expect(pageTitle).to.equal(foDefaultMyAccountPage.pageTitle);
    });

    it('should logOut with link in the footer', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'signOutWithLinkAtAccountPage', baseContext);

      await foDefaultMyAccountPage.logout(page);

      const isCustomerConnected = await foDefaultMyAccountPage.isCustomerConnected(page);
      expect(isCustomerConnected, 'Customer is connected!').to.eq(false);
    });
  });
});
