import {expect} from 'chai';
import testContext from '@utils/testContext';

import {
  foDefaultHomePage,
  foDefaultLoginPage,
  foDefaultMyAccountPage,
  foDefaultMyAddressesPage,
  foDefaultMyAddressesCreatePage,
  foDefaultMyCreditSlipsPage,
  foDefaultMyGDPRPersonalDataPage,
  foDefaultMyInformationsPage,
  foDefaultMyOrderDetailsPage,
  foDefaultMyOrderHistoryPage,
  foDefaultMyWishlistsPage,
  foDefaultMyWishlistsViewPage,
} from '@utils/foDefaultPages';

import {
  type BrowserContext,
  dataCustomers,
  type Page,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'audit_FO_default_connected';

describe('Check FO connected pages', async () => {
  let browserContext: BrowserContext;
  let page: Page;

  before(async function () {
    utilsPlaywright.setErrorsCaptured(true);

    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  beforeEach(async () => {
    utilsPlaywright.resetJsErrors();
  });

  it('should go to the home page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToHome', baseContext);

    await foDefaultHomePage.goTo(page, global.FO.URL);

    const result = await foDefaultHomePage.isHomePage(page);
    expect(result).to.eq(true);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to login page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToLoginFO', baseContext);

    await foDefaultHomePage.goToLoginPage(page);

    const pageTitle = await foDefaultLoginPage.getPageTitle(page);
    expect(pageTitle).to.contains(foDefaultLoginPage.pageTitle);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should sign in with default customer', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'customerLogin', baseContext);

    await foDefaultLoginPage.customerLogin(page, dataCustomers.johnDoe);

    const isCustomerConnected = await foDefaultLoginPage.isCustomerConnected(page);
    expect(isCustomerConnected).to.eq(true);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to account page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToAccountPage', baseContext);

    await foDefaultHomePage.goToMyAccountPage(page);

    const pageTitle = await foDefaultMyAccountPage.getPageTitle(page);
    expect(pageTitle).to.contains(foDefaultMyAccountPage.pageTitle);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to the "Your personal information" page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToInformationPage', baseContext);

    await foDefaultMyAccountPage.goToInformationPage(page);

    const pageTitle = await foDefaultMyInformationsPage.getPageTitle(page);
    expect(pageTitle).to.equal(foDefaultMyInformationsPage.pageTitle);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to the "Your addresses" page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToAddressesPage', baseContext);

    await foDefaultMyInformationsPage.goToMyAccountPage(page);
    await foDefaultMyAccountPage.goToAddressesPage(page);

    const pageHeaderTitle = await foDefaultMyAddressesPage.getPageTitle(page);
    expect(pageHeaderTitle).to.equal(foDefaultMyAddressesPage.pageTitle);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to the "New address" page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToNewAddressPage', baseContext);

    await foDefaultMyAddressesPage.openNewAddressForm(page);

    const pageHeaderTitle = await foDefaultMyAddressesCreatePage.getHeaderTitle(page);
    expect(pageHeaderTitle).to.equal(foDefaultMyAddressesCreatePage.creationFormTitle);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to the "Order history" page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToHistoryAndDetailsPage', baseContext);

    await foDefaultMyInformationsPage.goToMyAccountPage(page);
    await foDefaultMyAccountPage.goToHistoryAndDetailsPage(page);

    const pageTitle = await foDefaultMyOrderHistoryPage.getPageTitle(page);
    expect(pageTitle).to.contains(foDefaultMyOrderHistoryPage.pageTitle);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to the "Order details" page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToDetailsPage', baseContext);

    await foDefaultMyOrderHistoryPage.goToDetailsPage(page, 1);

    const pageTitle = await foDefaultMyOrderDetailsPage.getPageTitle(page);
    expect(pageTitle).to.equal(foDefaultMyOrderDetailsPage.pageTitle);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to the "Credit slips" page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToCreditSlipsPage', baseContext);

    await foDefaultMyInformationsPage.goToMyAccountPage(page);
    await foDefaultMyAccountPage.goToCreditSlipsPage(page);

    const pageTitle = await foDefaultMyCreditSlipsPage.getPageTitle(page);
    expect(pageTitle).to.equal(foDefaultMyCreditSlipsPage.pageTitle);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  // @todo : https://github.com/PrestaShop/PrestaShop/issues/834
  it.skip('should go to the "My wishlists" page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToMyWishlistsPage', baseContext);

    await foDefaultMyInformationsPage.goToMyAccountPage(page);
    await foDefaultMyAccountPage.goToMyWishlistsPage(page);

    const pageTitle = await foDefaultMyWishlistsPage.getPageTitle(page);
    expect(pageTitle).to.contains(foDefaultMyWishlistsPage.pageTitle);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  // @todo : https://github.com/PrestaShop/PrestaShop/issues/834
  it.skip('should go to the "My wishlist" page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToWishlistPage', baseContext);

    await foDefaultMyWishlistsPage.goToWishlistPage(page, 1);

    const pageTitle = await foDefaultMyWishlistsViewPage.getPageTitle(page);
    expect(pageTitle).to.contains('My wishlist');

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to the "GDPR - Personal data" page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToMyGDPRPersonalDataPage', baseContext);

    await foDefaultMyInformationsPage.goToMyAccountPage(page);
    await foDefaultMyAccountPage.goToMyGDPRPersonalDataPage(page);

    const pageTitle = await foDefaultMyGDPRPersonalDataPage.getPageTitle(page);
    expect(pageTitle).to.equal(foDefaultMyGDPRPersonalDataPage.pageTitle);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should logout', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'logout', baseContext);

    await foDefaultMyGDPRPersonalDataPage.logout(page);

    const result = await foDefaultHomePage.isHomePage(page);
    expect(result).to.eq(true);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });
});
