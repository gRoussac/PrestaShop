import testContext from '@utils/testContext';
import {expect} from 'chai';

import deleteCacheTest from '@commonTests/BO/advancedParameters/cache';
import {deleteCustomerTest} from '@commonTests/BO/customers/customer';
import {createAccountTest} from '@commonTests/FO/default/account';

import {
  foDefaultAboutUsPage,
  foDefaultBestSalesPage,
  foDefaultContactUsPage,
  foDefaultCreateAccountPage,
  foDefaultDeliveryPage,
  foDefaultGuestOrderTrackingPage,
  foDefaultHomePage,
  foDefaultLegalNoticePage,
  foDefaultLoginPage,
  foDefaultMyAddressesPage,
  foDefaultMyAddressesCreatePage,
  foDefaultMyCreditSlipsPage,
  foDefaultMyInformationsPage,
  foDefaultMyOrderHistoryPage,
  foDefaultMyWishlistsPage,
  foDefaultNewProductsPage,
  foDefaultPricesDropPage,
  foDefaultSecurePaymentPage,
  foDefaultSitemapPage,
  foDefaultStoresPage,
  foDefaultTermsAndConditionsOfUsePage,
} from '@utils/foDefaultPages';

import {
  type BrowserContext,
  dataCustomers,
  FakerCustomer,
  type Page,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_FO_default_headerAndFooter_checkLinksInFooter';

/*
Pre-condition:
- Create new customer account
- Delete cache
Scenario:
- Go to FO
- Check footer Products links( Prices drop, New products and Best sales)
Check our company links( Delivery, Legal notices, Terms and conditions of use, About us, Secure payment, Contact us,
Sitemap, Stores)
- Check your account links( Personal info, Orders, Credit slips, Addresses)
- Check store information
- Check copyright
Post-condition:
- Delete created customer
 */
describe('FO - Header and Footer : Check links in footer page', async () => {
  let browserContext: BrowserContext;
  let page: Page;
  let pageTitle: string;

  const today: Date = new Date();
  const currentYear: string = today.getFullYear().toString();
  const createCustomerData: FakerCustomer = new FakerCustomer();

  // Pre-condition: Create new account on FO
  createAccountTest(createCustomerData, `${baseContext}_preTest_1`);

  // Pre-condition: Delete cache
  deleteCacheTest(`${baseContext}_preTest_2`);

  describe('Check links in footer page', async () => {
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
      expect(isHomePage).to.be.eq(true);
    });

    describe('Check \'Products\' footer links', async () => {
      [
        {linkSelector: 'Prices drop', pageTitle: foDefaultPricesDropPage.pageTitle},
        {linkSelector: 'New products', pageTitle: foDefaultNewProductsPage.pageTitle},
        {linkSelector: 'Best sellers', pageTitle: foDefaultBestSalesPage.pageTitle},
      ].forEach((args, index: number) => {
        it(`should check '${args.linkSelector}' footer links`, async function () {
          await testContext.addContextItem(this, 'testIdentifier', `checkProductsFooterLinks${index}`, baseContext);

          // Check prices drop link
          await foDefaultHomePage.goToFooterLink(page, args.linkSelector);

          const pageTitle = await foDefaultHomePage.getPageTitle(page);
          expect(pageTitle).to.equal(args.pageTitle);
        });
      });
    });

    describe('Check \'Our Company\' footer links', async () => {
      [
        {linkSelector: 'Delivery', pageTitle: foDefaultDeliveryPage.pageTitle},
        {linkSelector: 'Legal Notice', pageTitle: foDefaultLegalNoticePage.pageTitle},
        {linkSelector: 'Terms and conditions of use', pageTitle: foDefaultTermsAndConditionsOfUsePage.pageTitle},
        {linkSelector: 'About us', pageTitle: foDefaultAboutUsPage.pageTitle},
        {linkSelector: 'Secure payment', pageTitle: foDefaultSecurePaymentPage.pageTitle},
        {linkSelector: 'Contact us', pageTitle: foDefaultContactUsPage.pageTitle},
        {linkSelector: 'Sitemap', pageTitle: foDefaultSitemapPage.pageTitle},
        {linkSelector: 'Stores', pageTitle: foDefaultStoresPage.pageTitle},
      ].forEach((args, index: number) => {
        it(`should check '${args.linkSelector}' footer links`, async function () {
          await testContext.addContextItem(this, 'testIdentifier', `checkOurCompanyFooterLinks${index}`, baseContext);

          // Check prices drop link
          await foDefaultHomePage.goToFooterLink(page, args.linkSelector);

          const pageTitle = await foDefaultHomePage.getPageTitle(page);
          expect(pageTitle).to.equal(args.pageTitle);
        });
      });
    });

    describe('Check \'Your Account\' footer links before login', async () => {
      [
        {linkSelector: 'Order tracking', pageTitle: foDefaultGuestOrderTrackingPage.pageTitle},
        {linkSelector: 'Sign in', pageTitle: foDefaultLoginPage.pageTitle},
        {linkSelector: 'Create account', pageTitle: foDefaultCreateAccountPage.formTitle},
      ].forEach((args, index: number) => {
        it(`should check '${args.linkSelector}' footer links`, async function () {
          await testContext.addContextItem(this, 'testIdentifier', `checkYourAccountFooterLinks1${index}`, baseContext);

          // Check prices drop link
          await foDefaultHomePage.goToFooterLink(page, args.linkSelector);

          if (args.linkSelector === 'Create account') {
            pageTitle = await foDefaultCreateAccountPage.getHeaderTitle(page);
          } else {
            pageTitle = await foDefaultHomePage.getPageTitle(page);
          }
          expect(pageTitle).to.equal(args.pageTitle);
        });
      });
    });

    describe('Check \'Your Account\' footer links after login with default customer', async () => {
      it('should login to FO', async function () {
        await testContext.addContextItem(this, 'testIdentifier', 'loginFO', baseContext);

        await foDefaultHomePage.goToLoginPage(page);
        await foDefaultLoginPage.customerLogin(page, dataCustomers.johnDoe);

        const isCustomerConnected = await foDefaultLoginPage.isCustomerConnected(page);
        expect(isCustomerConnected, 'Customer is not connected').to.equal(true);
      });

      [
        {linkSelector: 'Information', pageTitle: foDefaultMyInformationsPage.pageTitle},
        {linkSelector: 'Addresses', pageTitle: foDefaultMyAddressesPage.pageTitle},
        {linkSelector: 'Orders', pageTitle: foDefaultMyOrderHistoryPage.pageTitle},
        {linkSelector: 'Credit slips', pageTitle: foDefaultMyCreditSlipsPage.pageTitle},
        // @todo : https://github.com/PrestaShop/PrestaShop/issues/834
        // {linkSelector: 'Wishlist', pageTitle: foDefaultMyWishlistsPage.pageTitle},
        {linkSelector: 'Sign out', pageTitle: foDefaultLoginPage.pageTitle},
      ].forEach((args, index: number) => {
        it(`should check '${args.linkSelector}' footer links`, async function () {
          await testContext.addContextItem(this, 'testIdentifier', `checkYourAccountFooterLinks2${index}`, baseContext);

          // Check prices drop link
          await foDefaultHomePage.goToFooterLink(page, args.linkSelector);

          if (args.linkSelector === 'Wishlist') {
            pageTitle = await foDefaultMyWishlistsPage.getPageTitle(page);
          } else {
            pageTitle = await foDefaultHomePage.getPageTitle(page);
          }
          expect(pageTitle).to.equal(args.pageTitle);
        });
      });
    });

    // Pre-condition: Delete cache
    deleteCacheTest(`${baseContext}_preTest3`);

    describe('Check \'Your Account\' footer links after login with new customer without address', async () => {
      it('should login to FO', async function () {
        await testContext.addContextItem(this, 'testIdentifier', 'loginFONewCustomer', baseContext);

        await foDefaultLoginPage.customerLogin(page, createCustomerData);

        const isCustomerConnected = await foDefaultLoginPage.isCustomerConnected(page);
        expect(isCustomerConnected, 'Customer is not connected').to.equal(true);
      });

      [
        {linkSelector: 'Information', pageTitle: foDefaultMyInformationsPage.pageTitle},
        {linkSelector: 'Add first address', pageTitle: foDefaultMyAddressesCreatePage.pageTitle},
        {linkSelector: 'Orders', pageTitle: foDefaultMyOrderHistoryPage.pageTitle},
        {linkSelector: 'Credit slips', pageTitle: foDefaultMyCreditSlipsPage.pageTitle},
        // @todo : https://github.com/PrestaShop/PrestaShop/issues/834
        // {linkSelector: 'Wishlist', pageTitle: foDefaultMyWishlistsPage.pageTitle},
        {linkSelector: 'Sign out', pageTitle: foDefaultLoginPage.pageTitle},
      ].forEach((args, index: number) => {
        it(`should check '${args.linkSelector}' footer links`, async function () {
          await testContext.addContextItem(this, 'testIdentifier', `checkYourAccountFooterLinks3${index}`, baseContext);

          // Check prices drop link
          await foDefaultHomePage.goToFooterLink(page, args.linkSelector);

          if (args.linkSelector === 'Wishlist') {
            pageTitle = await foDefaultMyWishlistsPage.getPageTitle(page);
          } else {
            pageTitle = await foDefaultHomePage.getPageTitle(page);
          }
          expect(pageTitle).to.equal(args.pageTitle);
        });
      });
    });

    describe('Check \'Store Information\'', async () => {
      it('should check \'Store Information\'', async function () {
        await testContext.addContextItem(this, 'testIdentifier', 'checkStoreInformation', baseContext);

        const storeInformation = await foDefaultHomePage.getStoreInformation(page);
        expect(storeInformation).to.contains(global.INSTALL.SHOP_NAME)
          .and.to.contain(global.INSTALL.COUNTRY)
          .and.to.contains(global.BO.EMAIL);
      });
    });

    describe('Check the copyright', async () => {
      it('should check the copyright', async function () {
        await testContext.addContextItem(this, 'testIdentifier', 'checkCopyright', baseContext);

        const copyright = await foDefaultHomePage.getCopyright(page);
        expect(copyright).to.equal(`© ${currentYear} - Ecommerce software by PrestaShop™`);
      });
    });
  });

  // Post-condition: Delete the created customer account
  deleteCustomerTest(createCustomerData, `${baseContext}_postTest_1`);
});
