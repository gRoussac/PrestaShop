import testContext from '@utils/testContext';
import {expect} from 'chai';

import {createCartRuleTest, deleteCartRuleTest} from '@commonTests/BO/catalog/cartRule';

import {
  foDefaultCartPage,
  foDefaultHomePage,
  foDefaultModalBlockCartPage,
  foDefaultModalQuickViewPage,
} from '@utils/foDefaultPages';

import {
  type BrowserContext,
  FakerCartRule,
  type Page,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_FO_default_cart_cart_addPromoCode';

describe('FO - Cart : Add promo code', async () => {
  let browserContext: BrowserContext;
  let page: Page;

  // Data to create cart rule
  const newCartRuleData: FakerCartRule = new FakerCartRule({
    name: 'reduction',
    code: 'reduc',
    discountType: 'Amount',
    discountAmount: {
      value: 20,
      currency: 'EUR',
      tax: 'Tax included',
    },
  });
  const newCartRuleDiscount: number = parseFloat(newCartRuleData.discountAmount!.value.toString());

  // Pre-condition: Create cart rule and apply the discount to 'productWithCartRule'
  createCartRuleTest(newCartRuleData, `${baseContext}_PreTest_1`);

  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  describe('Check promo code block', async () => {
    it('should go to FO', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToFo', baseContext);

      await foDefaultHomePage.goToFo(page);
      await foDefaultHomePage.changeLanguage(page, 'en');

      const isHomePage = await foDefaultHomePage.isHomePage(page);
      expect(isHomePage).to.eq(true);
    });

    it('should add the first product to cart and proceed to checkout', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addFirstProductToCart', baseContext);

      await foDefaultHomePage.quickViewProduct(page, 1);
      await foDefaultModalQuickViewPage.addToCartByQuickView(page);
      await foDefaultModalBlockCartPage.proceedToCheckout(page);

      const pageTitle = await foDefaultCartPage.getPageTitle(page);
      expect(pageTitle).to.eq(foDefaultCartPage.pageTitle);
    });

    it('should add the promo code and check the total', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkTotalAfterDiscount', baseContext);

      await foDefaultCartPage.addPromoCode(page, newCartRuleData.code);

      const isVisible = await foDefaultCartPage.isCartRuleNameVisible(page);
      expect(isVisible).to.eq(true);
    });

    it('should check the cart rule name', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkCartRuleName', baseContext);

      const cartRuleName = await foDefaultCartPage.getCartRuleName(page);
      expect(cartRuleName).to.contains(newCartRuleData.name);
    });

    it('should check the discount value', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkDiscountValue', baseContext);

      const totalBeforeDiscount = await foDefaultCartPage.getCartRuleValue(page);
      expect(totalBeforeDiscount).to.contains(`-€${newCartRuleDiscount.toFixed(2)}`);
    });

    it('should set the same promo code and check the error message', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'samePromoCode', baseContext);

      await foDefaultCartPage.addPromoCode(page, newCartRuleData.code);

      const isVisible = await foDefaultCartPage.isCartRuleNameVisible(page, 2);
      expect(isVisible).to.eq(false);

      const voucherErrorText = await foDefaultCartPage.getCartRuleErrorMessage(page);
      expect(voucherErrorText).to.equal(foDefaultCartPage.cartRuleAlreadyInYourCartErrorText);
    });

    it('should set a not existing promo code and check the error message', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'notExistingPromoCode', baseContext);

      await foDefaultCartPage.addPromoCode(page, 'reduction', false);

      const isVisible = await foDefaultCartPage.isCartRuleNameVisible(page, 2);
      expect(isVisible).to.eq(false);

      const voucherErrorText = await foDefaultCartPage.getCartRuleErrorMessage(page);
      expect(voucherErrorText).to.equal(foDefaultCartPage.cartRuleNotExistingErrorText);
    });

    it('should leave the promo code input blanc and check the error message', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'leavePromoCodeEmpty', baseContext);

      await foDefaultCartPage.addPromoCode(page, '', false);

      const voucherErrorText = await foDefaultCartPage.getCartRuleErrorMessage(page);
      expect(voucherErrorText).to.contains(foDefaultCartPage.cartRuleMustEnterVoucherErrorText);
    });
  });

  // Post-Condition: Delete cart rule
  deleteCartRuleTest(newCartRuleData.name, `${baseContext}_PostTest_1`);
});
