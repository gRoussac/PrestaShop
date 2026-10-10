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
  dataCarriers,
  dataCustomers,
  dataPaymentMethods,
  dataProducts,
  type Page,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

import {expect} from 'chai';

// context
const baseContext: string = 'functional_FO_default_orderConfirmation_displayOfProductCustomization';

/*
Scenario:
- Add product with customization to cart
- Proceed to checkout and confirm the order
- Check the payment confirmation details
- Check the customization modal
*/
describe('FO - Order confirmation : Display of product customization', async () => {
  let browserContext: BrowserContext;
  let page: Page;

  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  describe('Create new order in FO', async () => {
    it('should open the shop page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'openFoShop', baseContext);

      await foDefaultHomePage.goToFo(page);
      await foDefaultHomePage.changeLanguage(page, 'en');

      const result = await foDefaultHomePage.isHomePage(page);
      expect(result).to.equal(true);
    });

    it('should go to home page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToHomePage', baseContext);

      await foDefaultHomePage.goToHomePage(page);

      const result = await foDefaultHomePage.isHomePage(page);
      expect(result).to.eq(true);
    });

    it(`should search for the product ${dataProducts.demo_14.name} and go to product page`, async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'searchProduct', baseContext);

      await foDefaultHomePage.setProductNameInSearchInput(page, dataProducts.demo_14.name);
      await foDefaultHomePage.clickAutocompleteSearchResult(page, 1);

      const pageTitle = await foDefaultProductPage.getPageTitle(page);
      expect(pageTitle).to.contains(dataProducts.demo_14.name);
    });

    it('should add custom text and add the product to cart', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addProductToCart', baseContext);

      await foDefaultProductPage.addProductToTheCart(page, 1, undefined, true, 'Hello world!');

      const pageTitle = await foDefaultCartPage.getPageTitle(page);
      expect(pageTitle).to.equal(foDefaultCartPage.pageTitle);
    });

    it('should validate shopping cart and go to checkout page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToCheckoutPage', baseContext);

      await foDefaultCartPage.clickOnProceedToCheckout(page);

      const isCheckoutPage = await foDefaultCheckoutPage.isCheckoutPage(page);
      expect(isCheckoutPage).to.equal(true);
    });

    it('should sign in by default customer', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'signInFO', baseContext);

      await foDefaultCheckoutPage.clickOnSignIn(page);

      const isCustomerConnected = await foDefaultCheckoutPage.customerLogin(page, dataCustomers.johnDoe);
      expect(isCustomerConnected, 'Customer is not connected!').to.equal(true);
    });

    it('should go to delivery step', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToDeliveryStep', baseContext);

      // Address step - Go to delivery step
      const isStepAddressComplete = await foDefaultCheckoutPage.goToDeliveryStep(page);
      expect(isStepAddressComplete, 'Step Address is not complete').to.equal(true);
    });

    it('should select the first carrier and go to payment step', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkShippingPrice1', baseContext);

      await foDefaultCheckoutPage.chooseShippingMethod(page, dataCarriers.myCarrier.id);

      const isPaymentStep = await foDefaultCheckoutPage.goToPaymentStep(page);
      expect(isPaymentStep).to.eq(true);
    });

    it('should Pay by bank wire and confirm order', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'confirmOrder', baseContext);

      await foDefaultCheckoutPage.choosePaymentAndOrder(page, dataPaymentMethods.wirePayment.moduleName);

      const pageTitle = await foDefaultCheckoutOrderConfirmationPage.getPageTitle(page);
      expect(pageTitle).to.equal(foDefaultCheckoutOrderConfirmationPage.pageTitle);

      const cardTitle = await foDefaultCheckoutOrderConfirmationPage.getOrderConfirmationCardTitle(page);
      expect(cardTitle).to.contains(foDefaultCheckoutOrderConfirmationPage.orderConfirmationCardTitle);
    });
  });

  describe('Check list of ordered products', async () => {
    it('should check the payment information', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkPaymentInformation', baseContext);

      const totalToPay: string = (dataProducts.demo_14.finalPrice + dataCarriers.myCarrier.priceTTC).toFixed(2);

      const paymentInformation = await foDefaultCheckoutOrderConfirmationPage.getPaymentInformation(page);
      expect(paymentInformation).to.contains('You have chosen payment by '
        + `${dataPaymentMethods.wirePayment.displayName.toLowerCase()}`)
        .and.to.contains(`Amount €${totalToPay}`);
    });

    it('should check the order details', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkOrderDetails', baseContext);

      const orderDetails = await foDefaultCheckoutOrderConfirmationPage.getOrderDetails(page);
      expect(orderDetails).to.contains(`${dataPaymentMethods.wirePayment.displayName} Shipping method: `
        + `${dataCarriers.myCarrier.name} - ${dataCarriers.myCarrier.transitName}`);
    });

    it('should check the products number', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkProductsNumber', baseContext);

      const productsNumber = await foDefaultCheckoutOrderConfirmationPage.getNumberOfProducts(page);
      expect(productsNumber).to.equal(1);
    });

    it('should check the details of the first product in list', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkProductDetails', baseContext);

      const result = await foDefaultCheckoutOrderConfirmationPage.getProductDetailsInRow(page, 1);
      await Promise.all([
        expect(result.image).to.contains(dataProducts.demo_14.coverImage),
        expect(result.details).to.contains(dataProducts.demo_14.name),
        expect(result.details).to.contains(`Reference: ${dataProducts.demo_14.reference}`),
        expect(result.details).to.contains('Product customization Type your text here Hello world!'),
        expect(result.prices).to.equal(`€${dataProducts.demo_14.finalPrice}`),
      ]);
    });

    it('should click on the button Customized and check the modal', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'clickOnCustomizedProduct', baseContext);

      const isModalVisible = await foDefaultCheckoutOrderConfirmationPage.clickOnCustomizedButton(page);
      expect(isModalVisible).to.equal(true);
    });

    it('should check the modal content', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkModalContent', baseContext);

      const modalContent = await foDefaultCheckoutOrderConfirmationPage.getModalProductCustomizationContent(page);
      expect(modalContent).to.equal('Type your text here Hello world!');
    });

    it('should close the modal', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'closeModal', baseContext);

      const isModalNotVisible = await foDefaultCheckoutOrderConfirmationPage.closeModalProductCustomization(page);
      expect(isModalNotVisible).to.equal(true);
    });
  });
});
