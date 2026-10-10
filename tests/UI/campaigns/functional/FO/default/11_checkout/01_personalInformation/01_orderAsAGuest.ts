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
  FakerAddress,
  FakerCustomer,
  type Page,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

import {expect} from 'chai';

const baseContext: string = 'functional_FO_default_checkout_personalInformation_orderAsAGuest';

/*
Scenario:
- Open FO page
- Add first product to the cart
- Proceed to checkout and validate the cart
- Fill guest personal information
- Complete the order
 */

describe('FO - Checkout - Personal information : Order as a guest', async () => {
  let browserContext: BrowserContext;
  let page: Page;
  const guestData: FakerCustomer = new FakerCustomer({password: ''});
  const secondGuestData: FakerCustomer = new FakerCustomer({password: ''});
  const addressData: FakerAddress = new FakerAddress({country: 'France'});

  // before and after functions
  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  describe('Order as a guest', async () => {
    it('should open FO page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'openFO', baseContext);

      // Go to FO and change language
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
      expect(isCheckoutPage).to.equal(true);
    });

    it('should fill guest personal information', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'setPersonalInformation', baseContext);

      const isStepPersonalInfoCompleted = await foDefaultCheckoutPage.setGuestPersonalInformation(page, guestData);
      expect(isStepPersonalInfoCompleted, 'Step personal information is not completed').to.equal(true);
    });

    it('should click on edit Personal information and edit the guest information', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkCustomerIdentity', baseContext);

      await foDefaultCheckoutPage.clickOnEditPersonalInformationStep(page);

      const isStepPersonalInfoCompleted = await foDefaultCheckoutPage.setGuestPersonalInformation(page, secondGuestData);
      expect(isStepPersonalInfoCompleted, 'Step personal information is not completed').to.equal(true);
    });

    it('should fill address form and go to delivery step', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'setAddressStep', baseContext);

      const isStepAddressComplete = await foDefaultCheckoutPage.setAddress(page, addressData);
      expect(isStepAddressComplete, 'Step Address is not complete').to.equal(true);
    });

    it('should validate the order', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'validateOrder', baseContext);

      // Delivery step - Go to payment step
      const isStepDeliveryComplete = await foDefaultCheckoutPage.goToPaymentStep(page);
      expect(isStepDeliveryComplete, 'Step Address is not complete').to.equal(true);

      // Payment step - Choose payment step
      await foDefaultCheckoutPage.choosePaymentAndOrder(page, dataPaymentMethods.wirePayment.moduleName);
      const cardTitle = await foDefaultCheckoutOrderConfirmationPage.getOrderConfirmationCardTitle(page);

      // Check the confirmation message
      expect(cardTitle).to.contains(foDefaultCheckoutOrderConfirmationPage.orderConfirmationCardTitle);
    });
  });
});
