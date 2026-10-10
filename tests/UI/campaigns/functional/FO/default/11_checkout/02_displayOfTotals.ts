import testContext from '@utils/testContext';
import {expect} from 'chai';

import {createCartRuleTest, deleteCartRuleTest} from '@commonTests/BO/catalog/cartRule';

import {
  foDefaultCartPage,
  foDefaultCheckoutPage,
  foDefaultHomePage,
  foDefaultLoginPage,
  foDefaultModalBlockCartPage,
  foDefaultModalQuickViewPage,
  foDefaultSearchResultsPage,
} from '@utils/foDefaultPages';

import {
  type BrowserContext,
  dataCarriers,
  dataCustomers,
  dataProducts,
  FakerCartRule,
  type Page,
  utilsDate,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_FO_default_checkout_displayOfTotals';

/*
Pre-condition:
- Create new cart rule
Scenario:
- Add product to cart
- Click on created promo code
- Check cart details
- Proceed to checkout
- Choose carrier and check details
Post-condition:
- Delete created cart rule
 */

describe('FO - Checkout : Display of total (price, vouchers, shipping)', async () => {
  let browserContext: BrowserContext;
  let page: Page;
  const pastDate: string = utilsDate.getDateFormat('yyyy-mm-dd', 'past');

  // Data to create cart rule with code
  const cartRuleWithCodeData: FakerCartRule = new FakerCartRule({
    name: 'kdo',
    code: '1234',
    highlight: true,
    dateFrom: pastDate,
    quantityPerUser: 100,
    quantity: 100,
    discountType: 'Amount',
    discountAmount: {
      value: 5,
      currency: 'EUR',
      tax: 'Tax included',
    },
  });
  const cartRuleDiscount: number = parseFloat(cartRuleWithCodeData.discountAmount!.value.toString());

  // Pre-condition: Create cart rule with code
  createCartRuleTest(cartRuleWithCodeData, `${baseContext}_preTest_1`);

  describe('Display total', async () => {
    before(async function () {
      browserContext = await utilsPlaywright.createBrowserContext(this.browser);
      page = await utilsPlaywright.newTab(browserContext);
    });

    after(async () => {
      await utilsPlaywright.closeBrowserContext(browserContext);
    });

    it('should go to FO', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToFo', baseContext);

      await foDefaultHomePage.goToFo(page);
      await foDefaultHomePage.changeLanguage(page, 'en');

      const isHomePage = await foDefaultHomePage.isHomePage(page);
      expect(isHomePage).to.equal(true);
    });

    it('should go to login page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToLoginPageFO', baseContext);

      await foDefaultHomePage.goToLoginPage(page);

      const pageTitle = await foDefaultLoginPage.getPageTitle(page);
      expect(pageTitle).to.contains(foDefaultLoginPage.pageTitle);
    });

    it('should sign in with created customer', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'sighInFO', baseContext);

      await foDefaultLoginPage.customerLogin(page, dataCustomers.johnDoe);

      const isCustomerConnected = await foDefaultLoginPage.isCustomerConnected(page);
      expect(isCustomerConnected, 'Customer is not connected').to.eq(true);
    });

    it(`should search for the product ${dataProducts.demo_12.name}`, async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'searchProduct', baseContext);

      await foDefaultHomePage.searchProduct(page, dataProducts.demo_12.name);

      const pageTitle = await foDefaultSearchResultsPage.getPageTitle(page);
      expect(pageTitle).to.equal(foDefaultSearchResultsPage.pageTitle);
    });

    it('should add the product to cart by quick view', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addProductToCart', baseContext);

      await foDefaultSearchResultsPage.quickViewProduct(page, 1);

      await foDefaultModalQuickViewPage.addToCartByQuickView(page);
      await foDefaultModalBlockCartPage.proceedToCheckout(page);

      const pageTitle = await foDefaultCartPage.getPageTitle(page);
      expect(pageTitle).to.equal(foDefaultCartPage.pageTitle);
    });

    it('should check the displayed promo code', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkPromoCodeBlock2', baseContext);

      const promoCode = await foDefaultCartPage.getHighlightPromoCode(page);
      expect(promoCode).to.equal(`${cartRuleWithCodeData.code} - ${cartRuleWithCodeData.name}`);
    });

    it('should click on the promo code', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addPromoCode2', baseContext);

      await foDefaultCartPage.clickOnPromoCode(page);

      const cartRuleName = await foDefaultCartPage.getCartRuleName(page, 1);
      expect(cartRuleName).to.contains(cartRuleWithCodeData.name);
    });

    it('should verify the total after the discount', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkTotalAfterDiscount3', baseContext);

      const totalAfterPromoCode: number = dataProducts.demo_12.finalPrice - cartRuleDiscount;

      const priceATI = await foDefaultCartPage.getATIPrice(page);
      expect(priceATI).to.equal(parseFloat(totalAfterPromoCode.toFixed(2)));

      const discountValue = await foDefaultCartPage.getCartRuleValue(page, 1);
      expect(discountValue).to.contains(`-€${cartRuleDiscount.toFixed(2)}`);
    });

    it('should validate shopping cart and go to checkout page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToCheckoutPage', baseContext);

      await foDefaultCartPage.clickOnProceedToCheckout(page);

      const isCheckoutPage = await foDefaultCheckoutPage.isCheckoutPage(page);
      expect(isCheckoutPage).to.equal(true);
    });

    it('should go to delivery step', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToDeliveryStep', baseContext);

      // Address step - Go to delivery step
      const isStepAddressComplete = await foDefaultCheckoutPage.goToDeliveryStep(page);
      expect(isStepAddressComplete, 'Step Address is not complete').to.equal(true);
    });

    it('should select the first carrier and check the shipping price', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkShippingPrice1', baseContext);

      await foDefaultCheckoutPage.chooseShippingMethod(page, dataCarriers.myCarrier.id);

      const shippingCost = await foDefaultCheckoutPage.getShippingCost(page);
      expect(shippingCost).to.equal(`€${dataCarriers.myCarrier.priceTTC.toFixed(2)}`);
    });

    it('should check the cart rule name', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkCartRuleName', baseContext);

      const cartRuleName = await foDefaultCheckoutPage.getCartRuleName(page, 1);
      expect(cartRuleName).to.contains(cartRuleWithCodeData.name);
    });

    it('should check the total', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkTotalAfterDiscount', baseContext);

      const totalAfterDiscount = await foDefaultCheckoutPage.getATIPrice(page);
      expect(totalAfterDiscount.toFixed(2))
        .to.equal(
          (dataProducts.demo_12.price - cartRuleDiscount + dataCarriers.myCarrier.priceTTC).toFixed(2),
        );
    });

    it('should remove the discount', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'removeTheDiscount', baseContext);

      const isDeleteIconNotVisible = await foDefaultCheckoutPage.removePromoCode(page);
      expect(isDeleteIconNotVisible, 'The discount is not removed').to.equal(true);
    });
  });

  // Post-condition: Delete created cart rule
  deleteCartRuleTest(cartRuleWithCodeData.name, `${baseContext}_postTest`);
});
