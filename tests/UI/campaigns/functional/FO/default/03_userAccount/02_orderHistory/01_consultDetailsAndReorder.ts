import testContext from '@utils/testContext';
import {expect} from 'chai';

// Import common tests
import {createAddressTest} from '@commonTests/BO/customers/address';
import {deleteCustomerTest} from '@commonTests/BO/customers/customer';
import {createAccountTest} from '@commonTests/FO/default/account';
import {createOrderByCustomerTest} from '@commonTests/FO/default/order';

import {
  foDefaultCheckoutPage,
  foDefaultCheckoutOrderConfirmationPage,
  foDefaultHomePage,
  foDefaultLoginPage,
  foDefaultMyAccountPage,
  foDefaultMyOrderDetailsPage,
  foDefaultMyOrderHistoryPage,
} from '@utils/foDefaultPages';

import {
  type BrowserContext,
  dataOrderStatuses,
  dataPaymentMethods,
  dataProducts,
  FakerAddress,
  FakerCustomer,
  FakerOrder,
  type Page,
  utilsDate,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_FO_default_userAccount_orderHistory_consultDetailsAndReorder';

/*
Pre-condition:
- Create customer
- Create address
Scenario:
- Go to orders history page
- Check that number of orders is 0
- Create order
- Check that number of orders is 1
- Click on details link
- Click on reorder link and reorder
Post-condition
- Delete customer
 */

describe('FO - User account - Order history : Consult details and Reorder', async () => {
  let browserContext: BrowserContext;
  let page: Page;

  const customerData: FakerCustomer = new FakerCustomer();
  const addressData: FakerAddress = new FakerAddress({
    email: customerData.email,
    country: 'France',
  });
  const orderData: FakerOrder = new FakerOrder({
    customer: customerData,
    products: [
      {
        product: dataProducts.demo_1,
        quantity: 1,
      },
    ],
    paymentMethod: dataPaymentMethods.wirePayment,
  });
  const today: string = utilsDate.getDateFormat('mm/dd/yyyy');

  // Pre-condition: Create new account
  createAccountTest(customerData, `${baseContext}_preTest_1`);

  // Pre-condition: Create new address
  createAddressTest(addressData, `${baseContext}_preTest_2`);

  // before and after functions
  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  describe('Check that no order has been placed in order history', async () => {
    it('should go to FO home page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToFoToCreateAccount', baseContext);

      await foDefaultHomePage.goToFo(page);

      const isHomePage = await foDefaultHomePage.isHomePage(page);
      expect(isHomePage).to.eq(true);
    });

    it('should go to login page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToLoginFoPage', baseContext);

      await foDefaultHomePage.goToLoginPage(page);

      const pageHeaderTitle = await foDefaultLoginPage.getPageTitle(page);
      expect(pageHeaderTitle).to.equal(foDefaultLoginPage.pageTitle);
    });

    it('should sign in FO', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'signInFo', baseContext);

      await foDefaultLoginPage.customerLogin(page, customerData);

      const isCustomerConnected = await foDefaultMyAccountPage.isCustomerConnected(page);
      expect(isCustomerConnected, 'Customer is not connected').to.eq(true);
    });

    it('should go to order history page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToOrderHistoryPage', baseContext);

      await foDefaultHomePage.goToMyAccountPage(page);
      await foDefaultMyAccountPage.goToHistoryAndDetailsPage(page);

      const pageHeaderTitle = await foDefaultMyOrderHistoryPage.getPageTitle(page);
      expect(pageHeaderTitle).to.equal(foDefaultMyOrderHistoryPage.pageTitle);
    });

    it('should check number of orders', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkNumberOfOrders1', baseContext);

      const numberOfOrders = await foDefaultMyOrderHistoryPage.getNumberOfOrders(page);
      expect(numberOfOrders).to.equal(0);
    });
  });

  // Pre-condition: Create order
  createOrderByCustomerTest(orderData, `${baseContext}_preTest_3`);

  describe('Check that one order has been placed in order history', async () => {
    it('should reload the FO page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'reloadPage', baseContext);

      await foDefaultMyOrderHistoryPage.reloadPage(page);

      const pageHeaderTitle = await foDefaultMyOrderHistoryPage.getPageTitle(page);
      expect(pageHeaderTitle).to.equal(foDefaultMyOrderHistoryPage.pageTitle);
    });

    it('should check the number of orders', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkNumberOfOrders2', baseContext);

      const numberOfOrders = await foDefaultMyOrderHistoryPage.getNumberOfOrders(page);
      expect(numberOfOrders).to.equal(1);
    });

    it('should check the order information', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkOrderInformation', baseContext);

      const result = await foDefaultMyOrderHistoryPage.getOrderHistoryDetails(page);
      await Promise.all([
        expect(result.reference).not.null,
        expect(result.date).to.equal(today),
        expect(result.price).to.equal(`€${dataProducts.demo_1.finalPrice}`),
        expect(result.paymentType).to.equal(dataPaymentMethods.wirePayment.displayName),
        expect(result.status).to.equal(dataOrderStatuses.awaitingBankWire.name),
        expect(result.invoice).to.equal('--'),
      ]);
    });

    it('should go to order details page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToFoToOrderDetails', baseContext);

      await foDefaultMyOrderHistoryPage.goToDetailsPage(page);

      const pageTitle = await foDefaultMyOrderDetailsPage.getPageTitle(page);
      expect(pageTitle).to.equal(foDefaultMyOrderDetailsPage.pageTitle);
    });

    it('should go to order history page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToOrderHistoryPage2', baseContext);

      await foDefaultHomePage.goToMyAccountPage(page);
      await foDefaultMyAccountPage.goToHistoryAndDetailsPage(page);

      const pageHeaderTitle = await foDefaultMyOrderHistoryPage.getPageTitle(page);
      expect(pageHeaderTitle).to.equal(foDefaultMyOrderHistoryPage.pageTitle);
    });

    it('should reorder the last order', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'reorderLastOrder', baseContext);

      await foDefaultMyOrderHistoryPage.clickOnReorderLink(page);

      const isCheckoutPage = await foDefaultCheckoutPage.isCheckoutPage(page);
      expect(isCheckoutPage, 'Browser is not in checkout Page').to.eq(true);
    });

    it('should go to delivery step', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToDeliveryStep', baseContext);

      // Address step - Go to delivery step
      const isStepAddressComplete = await foDefaultCheckoutPage.goToDeliveryStep(page);
      expect(isStepAddressComplete, 'Step Address is not complete').to.eq(true);
    });

    it('should go to payment step', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToPaymentStep', baseContext);

      // Delivery step - Go to payment step
      const isStepDeliveryComplete = await foDefaultCheckoutPage.goToPaymentStep(page);
      expect(isStepDeliveryComplete, 'Step Address is not complete').to.eq(true);
    });

    it('should choose payment method and confirm the order', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'confirmOrder', baseContext);

      // Payment step - Choose payment step
      await foDefaultCheckoutPage.choosePaymentAndOrder(page, dataPaymentMethods.wirePayment.moduleName);

      // Check the confirmation message
      const cardTitle = await foDefaultCheckoutOrderConfirmationPage.getOrderConfirmationCardTitle(page);
      expect(cardTitle).to.contains(foDefaultCheckoutOrderConfirmationPage.orderConfirmationCardTitle);
    });
  });

  // Post-condition : Delete customer
  deleteCustomerTest(customerData, `${baseContext}_postTest_1`);
});
