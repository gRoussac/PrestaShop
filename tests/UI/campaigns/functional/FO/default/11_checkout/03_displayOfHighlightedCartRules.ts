import testContext from '@utils/testContext';
import {expect} from 'chai';

import {createCartRuleTest, deleteCartRuleTest} from '@commonTests/BO/catalog/cartRule';

import {
  foDefaultCartPage,
  foDefaultHomePage,
  foDefaultLoginPage,
  foDefaultModalBlockCartPage,
  foDefaultModalQuickViewPage,
  foDefaultSearchResultsPage,
} from '@utils/foDefaultPages';

import {
  type BrowserContext,
  dataProducts,
  FakerCartRule,
  type Page,
  utilsDate,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_FO_default_checkout_displayOfHighlightedCartRules';

/*
Pre-condition:
- Create new cart rule
Scenario:
- Add product to cart
- Click on promo code and click on apply
- Delete promo code
Post-condition:
- Delete created cart rule
 */

describe('FO - Checkout : Display of highlighted cart rule', async () => {
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

  // Pre-condition: Create cart rule with code
  createCartRuleTest(cartRuleWithCodeData, `${baseContext}_preTest_1`);

  describe('Display of highlighted promo code', async () => {
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

    it(`should search for the product ${dataProducts.demo_6.name}`, async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'searchProduct', baseContext);

      await foDefaultHomePage.searchProduct(page, dataProducts.demo_6.name);

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
      await testContext.addContextItem(this, 'testIdentifier', 'checkPromoCodeBlock', baseContext);

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

      const discount: number = parseFloat(cartRuleWithCodeData.discountAmount!.value.toString());
      const totalAfterPromoCode: number = dataProducts.demo_6.combinations[0].priceTI - discount;

      const priceATI = await foDefaultCartPage.getATIPrice(page);
      expect(priceATI).to.equal(parseFloat(totalAfterPromoCode.toFixed(2)));

      const discountValue = await foDefaultCartPage.getCartRuleValue(page, 1);
      expect(discountValue).to.contains(`-€${discount.toFixed(2)}`);
    });

    it('should remove the discount', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'removeTheDiscount', baseContext);

      const isDeleteIconNotVisible = await foDefaultCartPage.removeVoucher(page);
      expect(isDeleteIconNotVisible, 'The discount is not removed').to.equal(true);
    });

    it('should check the displayed promo code', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkPromoCodeBlock2', baseContext);

      const promoCode = await foDefaultCartPage.getHighlightPromoCode(page);
      expect(promoCode).to.equal(`${cartRuleWithCodeData.code} - ${cartRuleWithCodeData.name}`);
    });

    it('should verify the total without discount', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkTotalWithoutDiscount', baseContext);

      const priceATI = await foDefaultCartPage.getATIPrice(page);
      expect(priceATI).to.equal(dataProducts.demo_6.combinations[0].priceTI);
    });
  });

  // Post-condition: Delete created cart rule
  deleteCartRuleTest(cartRuleWithCodeData.name, `${baseContext}_postTest`);
});
