import {expect} from 'chai';
import testContext from '@utils/testContext';

import {
  foDefaultCartPage,
  foDefaultCheckoutOrderConfirmationPage,
  foDefaultCheckoutPage,
  foDefaultHomePage,
  foDefaultLoginPage,
  foDefaultProductPage,
} from '@utils/foDefaultPages';

import {
  type BrowserContext,
  dataCustomers,
  dataPaymentMethods,
  dataProducts,
  FakerOrder,
  type Page,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'audit_FO_default_cart';

describe('Check FO pages in the checkout process', async () => {
  let browserContext: BrowserContext;
  let page: Page;

  const orderData: FakerOrder = new FakerOrder({
    customer: dataCustomers.johnDoe,
    products: [
      {
        product: dataProducts.demo_1,
        quantity: 1,
      },
    ],
    paymentMethod: dataPaymentMethods.wirePayment,
  });

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
    await testContext.addContextItem(this, 'testIdentifier', 'goToHomePage', baseContext);

    await foDefaultHomePage.goToFo(page);
    await foDefaultHomePage.changeLanguage(page, 'en');

    const isHomePage = await foDefaultHomePage.isHomePage(page);
    expect(isHomePage).to.eq(true);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to login page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToLoginPageFO', baseContext);

    await foDefaultHomePage.goToLoginPage(page);

    const pageTitle = await foDefaultLoginPage.getPageTitle(page);
    expect(pageTitle).to.contains(foDefaultLoginPage.pageTitle);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should sign in with customer credentials', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'customerLogin', baseContext);

    await foDefaultLoginPage.customerLogin(page, orderData.customer);

    const isCustomerConnected = await foDefaultLoginPage.isCustomerConnected(page);
    expect(isCustomerConnected, 'Customer is not connected').to.eq(true);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to the product page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToProductPage', baseContext);

    await foDefaultLoginPage.goToHomePage(page);
    await foDefaultHomePage.goToProductPage(page, orderData.products[0].product.id);

    const pageTitle = await foDefaultProductPage.getPageTitle(page);
    expect(pageTitle.toUpperCase()).to.contains(dataProducts.demo_1.name.toUpperCase());

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should add product to cart', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'addProductToCart', baseContext);

    await foDefaultProductPage.addProductToTheCart(page, orderData.products[0].quantity);

    const notificationsNumber = await foDefaultCartPage.getCartNotificationsNumber(page);
    expect(notificationsNumber).to.be.equal(orderData.products[0].quantity);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to delivery step', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToDeliveryStep', baseContext);

    await foDefaultCartPage.clickOnProceedToCheckout(page);

    const isStepAddressComplete = await foDefaultCheckoutPage.goToDeliveryStep(page);
    expect(isStepAddressComplete).to.eq(true);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to payment step', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToPaymentStep', baseContext);

    const isStepDeliveryComplete = await foDefaultCheckoutPage.goToPaymentStep(page);
    expect(isStepDeliveryComplete).to.eq(true);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should choose payment method and confirm the order', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'confirmOrder', baseContext);

    await foDefaultCheckoutPage.choosePaymentAndOrder(page, orderData.paymentMethod.moduleName);

    const cardTitle = await foDefaultCheckoutOrderConfirmationPage.getOrderConfirmationCardTitle(page);
    expect(cardTitle).to.contains(foDefaultCheckoutOrderConfirmationPage.orderConfirmationCardTitle);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });
});
