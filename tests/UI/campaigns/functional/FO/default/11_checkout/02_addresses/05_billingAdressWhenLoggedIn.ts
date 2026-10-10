import testContext from '@utils/testContext';
import {expect} from 'chai';

import {
  foDefaultCartPage,
  foDefaultCheckoutPage,
  foDefaultHomePage,
  foDefaultModalBlockCartPage,
  foDefaultModalQuickViewPage,
} from '@utils/foDefaultPages';

import {
  type BrowserContext,
  dataCustomers,
  type Page,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_FO_default_checkout_addresses_billingAdressWhenLoggedIn';

describe('FO - Guest checkout: Billing address when logged in', async () => {
  let browserContext: BrowserContext;
  let page: Page;

  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  describe('Make an order with 2 different addresses for delivery and invoice', async () => {
    it('should go to FO', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToFo', baseContext);

      // Go to FO
      await foDefaultHomePage.goToFo(page);

      // Change FO language
      await foDefaultHomePage.changeLanguage(page, 'en');

      const isHomePage = await foDefaultHomePage.isHomePage(page);
      expect(isHomePage).to.eq(true);
    });

    it('should add the first product to cart and proceed to checkout', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addProductToCartAndCheckout', baseContext);

      await foDefaultHomePage.quickViewProduct(page, 3);
      await foDefaultModalQuickViewPage.addToCartByQuickView(page);
      await foDefaultModalBlockCartPage.proceedToCheckout(page);

      const pageTitle = await foDefaultCartPage.getPageTitle(page);
      expect(pageTitle).to.eq(foDefaultCartPage.pageTitle);
    });

    it('should validate shopping cart and go to checkout page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToCheckoutPage', baseContext);

      await foDefaultCartPage.clickOnProceedToCheckout(page);

      const isCheckoutPage = await foDefaultCheckoutPage.isCheckoutPage(page);
      expect(isCheckoutPage).to.eq(true);
    });

    it('should sign in by default customer', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'signInFO', baseContext);

      await foDefaultCheckoutPage.clickOnSignIn(page);

      const isCustomerConnected = await foDefaultCheckoutPage.customerLogin(page, dataCustomers.johnDoe);
      expect(isCustomerConnected).to.eq(true);

      const isAddressesStep = await foDefaultCheckoutPage.isAddressesStep(page);
      expect(isAddressesStep).to.eq(true);

      const isDeliveryAddressSelected = await foDefaultCheckoutPage.isDeliveryAddressSelected(page, 1);
      expect(isDeliveryAddressSelected).to.equal(true);

      const addressesNumber = await foDefaultCheckoutPage.getNumberOfAddresses(page);
      expect(addressesNumber).to.equal(2);
    });

    it('should click on \'Billing address differs from shipping address\' link', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'clickOnBillingAddressDifferent', baseContext);

      await foDefaultCheckoutPage.clickOnDifferentInvoiceAddressLink(page);

      const isInvoiceAddressBlockVisible = await foDefaultCheckoutPage.isInvoiceAddressBlockVisible(page);
      expect(isInvoiceAddressBlockVisible).to.eq(true);

      const addressesNumber = await foDefaultCheckoutPage.getNumberOfAddresses(page);
      expect(addressesNumber).to.equal(2);

      const invoiceAddressesNumber = await foDefaultCheckoutPage.getNumberOfInvoiceAddresses(page);
      expect(invoiceAddressesNumber).to.equal(2);

      const isInvoiceAddress1Selected = await foDefaultCheckoutPage.isInvoiceAddressSelected(page, 1);
      expect(isInvoiceAddress1Selected).to.equal(true);

      const isInvoiceAddress2Selected = await foDefaultCheckoutPage.isInvoiceAddressSelected(page, 2);
      expect(isInvoiceAddress2Selected).to.equal(false);
    });

    it('should choose the invoice address different than shipping address', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'invoiceAddressDiffShippingAddress', baseContext);

      await foDefaultCheckoutPage.selectInvoiceAddress(page, 2);

      const isInvoiceAddress1Selected = await foDefaultCheckoutPage.isInvoiceAddressSelected(page, 1);
      expect(isInvoiceAddress1Selected).to.equal(false);

      const isInvoiceAddress2Selected = await foDefaultCheckoutPage.isInvoiceAddressSelected(page, 2);
      expect(isInvoiceAddress2Selected).to.equal(true);
    });
  });
});
