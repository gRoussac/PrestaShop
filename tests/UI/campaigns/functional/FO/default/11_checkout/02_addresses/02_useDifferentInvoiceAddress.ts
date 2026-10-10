// Import utils
import testContext from '@utils/testContext';

import {
  foDefaultCartPage,
  foDefaultCheckoutPage,
  foDefaultCheckoutOrderConfirmationPage,
  foDefaultHomePage,
  foDefaultProductPage,
} from '@utils/foDefaultPages';

import {
  type BrowserContext,
  dataPaymentMethods,
  dataProducts,
  FakerAddress,
  FakerCustomer,
  type Page,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

import {expect} from 'chai';

const baseContext: string = 'functional_FO_default_checkout_addresses_useDifferentInvoiceAddress';

/*
Scenario:
- Go to FO
- Add product to cart
- Go to checkout page
- Choose to order as guest
- Add guest information
- Add delivery address
- Click on Use another address for invoice
- Fill a second form address
- Finish the order
*/
describe('FO - Checkout - Addresses: Use different invoice address', async () => {
  // Create faker data
  const guestData: FakerCustomer = new FakerCustomer({password: ''});
  const deliveryAddress: FakerAddress = new FakerAddress({country: 'France'});
  const invoiceAddress: FakerAddress = new FakerAddress({country: 'France'});

  let browserContext: BrowserContext;
  let page: Page;

  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  describe('Create new order with different invoice address', async () => {
    it('should go to FO', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToFo', baseContext);

      await foDefaultHomePage.goToFo(page);
      await foDefaultHomePage.changeLanguage(page, 'en');

      const isHomePage = await foDefaultHomePage.isHomePage(page);
      expect(isHomePage).to.equal(true);
    });

    it('should go to fourth product page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToProductPage', baseContext);

      await foDefaultHomePage.goToProductPage(page, 4);

      const pageTitle = await foDefaultProductPage.getPageTitle(page);
      expect(pageTitle).to.contains(dataProducts.demo_5.name);
    });

    it('should add product to cart and go to cart page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addProductToCart', baseContext);

      await foDefaultProductPage.addProductToTheCart(page, 1);

      const pageTitle = await foDefaultCartPage.getPageTitle(page);
      expect(pageTitle).to.equal(foDefaultCartPage.pageTitle);
    });

    it('should validate shopping cart and go to checkout page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToCheckoutPage', baseContext);

      // Proceed to checkout the shopping cart
      await foDefaultCartPage.clickOnProceedToCheckout(page);

      const isCheckoutPage = await foDefaultCheckoutPage.isCheckoutPage(page);
      expect(isCheckoutPage).to.equal(true);
    });

    it('should fill customer information', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'fillCustomerInformation', baseContext);

      const isStepCompleted = await foDefaultCheckoutPage.setGuestPersonalInformation(page, guestData);
      expect(isStepCompleted).to.equal(true);
    });

    it('should fill different delivery and invoice addresses', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'fillCustomerAddresses', baseContext);

      const isStepCompleted = await foDefaultCheckoutPage.setAddress(page, deliveryAddress, invoiceAddress);
      expect(isStepCompleted).to.equal(true);
    });

    it('should complete the order', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'completeTheOrder', baseContext);

      // Delivery step - Go to payment step
      const isStepDeliveryComplete = await foDefaultCheckoutPage.goToPaymentStep(page);
      expect(isStepDeliveryComplete).to.equal(true);

      // Payment step - Choose payment step
      await foDefaultCheckoutPage.choosePaymentAndOrder(page, dataPaymentMethods.wirePayment.moduleName);
      const cardTitle = await foDefaultCheckoutOrderConfirmationPage.getOrderConfirmationCardTitle(page);

      // Check the confirmation message
      expect(cardTitle).to.contains(foDefaultCheckoutOrderConfirmationPage.orderConfirmationCardTitle);
    });
  });
});
