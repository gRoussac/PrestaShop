import testContext from '@utils/testContext';
import {expect} from 'chai';

// Import commonTests
import {deleteCartRuleTest} from '@commonTests/BO/catalog/cartRule';

import {
  foDefaultCartPage,
  foDefaultCheckoutPage,
  foDefaultCheckoutOrderConfirmationPage,
  foDefaultHomePage,
  foDefaultLoginPage,
  foDefaultProductPage,
} from '@utils/foDefaultPages';

import {
  boCartRulesPage,
  boCartRulesCreatePage,
  boDashboardPage,
  boLoginPage,
  type BrowserContext,
  dataCustomers,
  dataPaymentMethods,
  dataProducts,
  FakerCartRule,
  type Page,
  utilsCore,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_BO_catalog_discounts_cartRules_CRUDCartRule_conditions_checkTotalAvailableForEachUser';

/*
Scenario:
- Create cart rule with total for each user = 1
- Go to FO, Add product to cart, login by default customer
- Add promo code and check total after discount
- Complete the order
- Try to use a second time the same promo code anc check the error message
- Logout and try to set a third time the promo code and check total after discount
Post-condition:
- Delete the created cart rule
*/
describe('BO - Catalog - Cart rules : Check Total available for each user', async () => {
  let browserContext: BrowserContext;
  let page: Page;

  const newCartRuleData: FakerCartRule = new FakerCartRule({
    name: 'New cart rule',
    code: '4QABV6L3',
    quantity: 2,
    quantityPerUser: 1,
    discountType: 'Percent',
    discountPercent: 20,
  });

  // before and after functions
  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  describe('BO : Create cart rule', async () => {
    it('should login in BO', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'loginBO', baseContext);

      await boLoginPage.goTo(page, global.BO.URL);
      await boLoginPage.successLogin(page, global.BO.EMAIL, global.BO.PASSWD);

      const pageTitle = await boDashboardPage.getPageTitle(page);
      expect(pageTitle).to.contains(boDashboardPage.pageTitle);
    });

    it('should go to \'Catalog > Discounts\' page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToDiscountsPage', baseContext);

      await boDashboardPage.goToSubMenu(
        page,
        boDashboardPage.catalogParentLink,
        boDashboardPage.discountsLink,
      );

      const pageTitle = await boCartRulesPage.getPageTitle(page);
      expect(pageTitle).to.contains(boCartRulesPage.pageTitle);
    });

    it('should go to new cart rule page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToNewCartRulePage', baseContext);

      await boCartRulesPage.goToAddNewCartRulesPage(page);

      const pageTitle = await boCartRulesCreatePage.getPageTitle(page);
      expect(pageTitle).to.contains(boCartRulesCreatePage.pageTitle);
    });

    it('should create cart rule', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'createCartRule', baseContext);

      const validationMessage = await boCartRulesCreatePage.createEditCartRules(page, newCartRuleData);
      expect(validationMessage).to.contains(boCartRulesCreatePage.successfulCreationMessage);
    });

    it('should view my shop', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'viewMyShop1', baseContext);

      // View my shop and init pages
      page = await boCartRulesCreatePage.viewMyShop(page);
      await foDefaultHomePage.changeLanguage(page, 'en');

      const isHomePage = await foDefaultHomePage.isHomePage(page);
      expect(isHomePage).to.eq(true);
    });
  });

  [
    {args: {testIdentifier: 'cartRuleAccepted', testTitle: 'for the first time by default customer'}},
    {args: {testIdentifier: 'cartRuleNotAccepted', testTitle: 'for the second time by default customer'}},
    {args: {testIdentifier: 'cartRuleAccepted_2', testTitle: 'for the third time without sign in'}},
  ].forEach((test, index) => {
    describe(`FO : Check the created cart rule '${test.args.testTitle}'`, async () => {
      it('should go to the first product page', async function () {
        await testContext.addContextItem(this, 'testIdentifier', `goToFirstProductPage${index}`, baseContext);

        await foDefaultHomePage.goToProductPage(page, 1);

        const pageTitle = await foDefaultProductPage.getPageTitle(page);
        expect(pageTitle.toUpperCase()).to.contains(dataProducts.demo_1.name.toUpperCase());
      });

      it('should add product to cart and proceed to checkout', async function () {
        await testContext.addContextItem(this, 'testIdentifier', `addProductToCart${index}`, baseContext);

        await foDefaultProductPage.addProductToTheCart(page);

        const notificationsNumber = await foDefaultCartPage.getCartNotificationsNumber(page);
        expect(notificationsNumber).to.be.equal(1);
      });

      it('should set the promo code', async function () {
        await testContext.addContextItem(this, 'testIdentifier', `addPromoCode${index}`, baseContext);

        await foDefaultCartPage.addPromoCode(page, newCartRuleData.code);
      });

      if (test.args.testIdentifier === 'cartRuleAccepted') {
        it('should verify the total after discount', async function () {
          await testContext.addContextItem(this, 'testIdentifier', 'verifyTotalAfterDiscount', baseContext);

          const discountedPrice = dataProducts.demo_1.finalPrice
            - utilsCore.percentage(dataProducts.demo_1.finalPrice, newCartRuleData.getDiscountPercent());

          const totalAfterDiscount = await foDefaultCartPage.getATIPrice(page);
          expect(totalAfterDiscount).to.equal(parseFloat(discountedPrice.toFixed(2)));
        });

        it('should proceed to checkout', async function () {
          await testContext.addContextItem(this, 'testIdentifier', 'ProceedToCheckout', baseContext);

          // Proceed to checkout the shopping cart
          await foDefaultCartPage.clickOnProceedToCheckout(page);

          const isCheckout = await foDefaultCheckoutPage.isCheckoutPage(page);
          expect(isCheckout).to.eq(true);
        });

        it('should sign in by default customer', async function () {
          await testContext.addContextItem(this, 'testIdentifier', 'signInFO', baseContext);

          await foDefaultCheckoutPage.clickOnSignIn(page);

          const isCustomerConnected = await foDefaultCheckoutPage.customerLogin(page, dataCustomers.johnDoe);
          expect(isCustomerConnected, 'Customer is not connected').to.eq(true);
        });

        it('should go to delivery address step', async function () {
          await testContext.addContextItem(this, 'testIdentifier', 'confirmAddressStep', baseContext);

          const isDeliveryStep = await foDefaultCheckoutPage.goToDeliveryStep(page);
          expect(isDeliveryStep, 'Delivery Step boc is not displayed').to.eq(true);
        });

        it('should choose the shipping method', async function () {
          await testContext.addContextItem(this, 'testIdentifier', 'shippingMethodStep', baseContext);

          const isPaymentStep = await foDefaultCheckoutPage.goToPaymentStep(page);
          expect(isPaymentStep, 'Payment Step bloc is not displayed').to.eq(true);
        });

        it('should choose the payment type and confirm the order', async function () {
          await testContext.addContextItem(this, 'testIdentifier', 'choosePaymentMethod', baseContext);

          await foDefaultCheckoutPage.choosePaymentAndOrder(page, dataPaymentMethods.wirePayment.moduleName);

          const cardTitle = await foDefaultCheckoutOrderConfirmationPage.getOrderConfirmationCardTitle(page);
          // Check the confirmation message
          expect(cardTitle).to.contains(foDefaultCheckoutOrderConfirmationPage.orderConfirmationCardTitle);
        });

        it('should go to home page', async function () {
          await testContext.addContextItem(this, 'testIdentifier', 'goToHomePage', baseContext);

          await foDefaultHomePage.clickOnHeaderLink(page, 'Logo');

          const pageTitle = await foDefaultHomePage.getPageTitle(page);
          expect(pageTitle).to.equal(foDefaultHomePage.pageTitle);
        });
      }
      if (test.args.testIdentifier === 'cartRuleNotAccepted') {
        it('should check the promo code error message', async function () {
          await testContext.addContextItem(this, 'testIdentifier', 'checkErrorMessage', baseContext);

          const voucherErrorText = await foDefaultCartPage.getCartRuleErrorMessage(page);
          expect(voucherErrorText).to.equal(foDefaultCartPage.cartRuleLimitUsageErrorText);
        });

        it('should sign out', async function () {
          await testContext.addContextItem(this, 'testIdentifier', 'signOut', baseContext);

          await foDefaultCartPage.logout(page);
          await foDefaultLoginPage.clickOnHeaderLink(page, 'Logo');

          const isCustomerConnected = await foDefaultHomePage.isCustomerConnected(page);
          expect(isCustomerConnected, 'Customer is connected!').to.eq(false);
        });
      }

      if (test.args.testIdentifier === 'cartRuleAccepted_2') {
        it('should check that the promo code is applied to the cart', async function () {
          await testContext.addContextItem(this, 'testIdentifier', 'checkPromoCode', baseContext);

          const discountedPrice = dataProducts.demo_1.finalPrice
            - utilsCore.percentage(dataProducts.demo_1.finalPrice, newCartRuleData.getDiscountPercent());

          const totalAfterDiscount = await foDefaultCartPage.getATIPrice(page);
          expect(totalAfterDiscount).to.equal(parseFloat(discountedPrice.toFixed(2)));
        });

        it('should delete the last product from the cart', async function () {
          await testContext.addContextItem(this, 'testIdentifier', 'deleteLastProduct', baseContext);

          await foDefaultCartPage.deleteProduct(page, 1);

          const notificationNumber = await foDefaultCartPage.getCartNotificationsNumber(page);
          expect(notificationNumber).to.eq(0);
        });
      }
    });
  });

  // Post-condition : Delete the created cart rule
  deleteCartRuleTest(newCartRuleData.name, `${baseContext}_postTest`);
});
