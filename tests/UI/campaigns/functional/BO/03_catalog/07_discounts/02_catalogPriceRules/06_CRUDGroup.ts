import testContext from '@utils/testContext';
import {expect} from 'chai';

import {
  foDefaultSearchResultsPage,
  foDefaultHomePage,
  foDefaultLoginPage,
  foDefaultProductPage,
} from '@utils/foDefaultPages';

import {
  // Import BO pages
  boCartRulesPage,
  boCatalogPriceRulesCreatePage,
  boCatalogPriceRulesPage,
  boDashboardPage,
  boLoginPage,
  // Import FO pages
  foDefaultCartPage,
  // Import data
  dataProducts,
  dataCustomers,
  FakerCatalogPriceRule,
  // Import type
  type BrowserContext,
  type Page,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_BO_catalog_discounts_catalogPriceRules_CRUDGroup';

describe('BO - Catalog - Discounts - Catalog price Rules : CRUD group', async () => {
  let browserContext: BrowserContext;
  let page: Page;

  const catalogPriceRuleData: FakerCatalogPriceRule = new FakerCatalogPriceRule({
    name: 'test',
    currency: 'All currencies',
    country: 'All countries',
    group: 'Customer',
    reductionType: 'Amount',
    reductionTax: 'Tax included',
    fromQuantity: 1,
    reduction: 10.00,
  });
  const editCatalogPriceRuleData: FakerCatalogPriceRule = new FakerCatalogPriceRule({
    ...catalogPriceRuleData,
    group: 'Visitor',
  });
  const editCatalogPriceRuleData2: FakerCatalogPriceRule = new FakerCatalogPriceRule({
    ...catalogPriceRuleData,
    group: 'All groups',
  });

  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  describe('Create catalog price rule in BO and check it in FO', async () => {
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

    it('should go to \'Catalog Price Rules\' tab', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToCatalogPriceRulesTab', baseContext);

      await boCartRulesPage.goToCatalogPriceRulesTab(page);

      const pageTitle = await boCatalogPriceRulesPage.getPageTitle(page);
      expect(pageTitle).to.contains(boCatalogPriceRulesPage.pageTitle);
    });

    it('should go to add catalog price rules page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goAddCatalogPriceRulesPage', baseContext);

      await boCatalogPriceRulesPage.goToAddNewCatalogPriceRulePage(page);

      const pageTitle = await boCatalogPriceRulesCreatePage.getPageTitle(page);
      expect(pageTitle).to.contains(boCatalogPriceRulesCreatePage.pageTitle);
    });

    it('should create new catalog price rule with group : Customer', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'createCatalogPriceRule', baseContext);

      const validationMessage = await boCatalogPriceRulesCreatePage.setCatalogPriceRule(page, catalogPriceRuleData);
      expect(validationMessage).to.contains(boCatalogPriceRulesPage.successfulCreationMessage);
    });

    it('should view my shop', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'viewMyShop_1', baseContext);

      // View my shop and init pages
      page = await boCatalogPriceRulesCreatePage.viewMyShop(page);
      await foDefaultHomePage.changeLanguage(page, 'en');

      const isHomePage = await foDefaultHomePage.isHomePage(page);
      expect(isHomePage).to.eq(true);
    });

    it('should login with the default customer', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'loginCustomer_2', baseContext);

      await foDefaultHomePage.goToLoginPage(page);
      await foDefaultLoginPage.customerLogin(page, dataCustomers.johnDoe);

      const connected = await foDefaultHomePage.isCustomerConnected(page);
      expect(connected, 'Customer is not connected in FO').to.eq(true);
    });

    it(`should search for the product '${dataProducts.demo_6.name}'`, async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'searchProduct', baseContext);

      await foDefaultHomePage.searchProduct(page, dataProducts.demo_6.name);

      const pageTitle = await foDefaultSearchResultsPage.getPageTitle(page);
      expect(pageTitle).to.equal(foDefaultSearchResultsPage.pageTitle);
    });

    it('should go to the product page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToProductPage', baseContext);

      await foDefaultSearchResultsPage.goToProductPage(page, 1);

      const pageTitle = await foDefaultProductPage.getPageTitle(page);
      expect(pageTitle).to.contains(dataProducts.demo_6.name);
    });

    it('should check the discount', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkDiscount', baseContext);

      // Check discount
      const columnValue = await foDefaultProductPage.getDiscountAmount(page);
      expect(columnValue).to.equal(`(Save €${catalogPriceRuleData.reduction.toFixed(2)})`);

      // Check final price
      const finalPrice = await foDefaultProductPage.getProductInformation(page);
      expect(finalPrice.price.toFixed(2)).to.equal(
        (
          dataProducts.demo_6.combinations[0].priceTI - catalogPriceRuleData.reduction
        ).toFixed(2),
      );
    });

    it('should add the product to the cart', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addProductToCart', baseContext);

      await foDefaultProductPage.addProductToTheCart(page);

      const pageTitle = await foDefaultCartPage.getPageTitle(page);
      expect(pageTitle).to.equal(foDefaultCartPage.pageTitle);
    });

    it('should check the discount in cart page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkDiscountInTheCart', baseContext);

      const productDetail = await foDefaultCartPage.getProductDetail(page, 1);
      await Promise.all([
        expect(productDetail.regularPrice).to.equal(dataProducts.demo_6.combinations[0].priceTI),
        expect(productDetail.price.toFixed(2)).to.equal(
          (
            dataProducts.demo_6.combinations[0].priceTI - catalogPriceRuleData.reduction
          ).toFixed(2),
        ),
        expect(productDetail.discountAmount).to.equal(`-€${catalogPriceRuleData.reduction.toFixed(2)}`),
      ]);
    });
  });

  describe('Edit catalog price rules and check it in FO - Group : Visitor', async () => {
    it('should go back to BO', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goBackToBO', baseContext);

      page = await foDefaultCartPage.changePage(browserContext, 0);

      const pageTitle = await boCatalogPriceRulesPage.getPageTitle(page);
      expect(pageTitle).to.contains(boCatalogPriceRulesPage.pageTitle);
    });

    it('should edit the catalog price rules', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'editCatalogPriceRules', baseContext);

      await boCatalogPriceRulesPage.goToEditCatalogPriceRulePage(page, catalogPriceRuleData.name);

      const pageTitle = await boCatalogPriceRulesCreatePage.getPageTitle(page);
      expect(pageTitle).to.contains(boCatalogPriceRulesCreatePage.editPageTitle);

      const validationMessage = await boCatalogPriceRulesCreatePage.setCatalogPriceRule(page, editCatalogPriceRuleData);
      expect(validationMessage).to.contains(boCatalogPriceRulesPage.successfulUpdateMessage);
    });

    it('should go back to FO', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goBackToFO', baseContext);

      page = await boCatalogPriceRulesCreatePage.changePage(browserContext, 1);

      const pageTitle = await foDefaultCartPage.getPageTitle(page);
      expect(pageTitle).to.contains(foDefaultCartPage.pageTitle);
    });

    it('should refresh and check that no reduction is applied', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkNoReduction', baseContext);

      await foDefaultCartPage.reloadPage(page);

      const productDetail = await foDefaultCartPage.getProductDetail(page, 1);
      await Promise.all([
        expect(productDetail.regularPrice).to.equal(dataProducts.demo_6.combinations[0].priceTI),
        expect(productDetail.price.toFixed(2)).to.equal(
          (
            dataProducts.demo_6.combinations[0].priceTI
          ).toFixed(2),
        ),
      ]);
    });

    it('should sign out', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'signOutFO', baseContext);

      await foDefaultCartPage.logout(page);

      const isCustomerConnected = await foDefaultCartPage.isCustomerConnected(page);
      expect(isCustomerConnected, 'Customer is connected').to.eq(false);
    });

    it('should check that no items in the cart', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkNotificationsNumber', baseContext);

      const notificationsNumber = await foDefaultCartPage.getCartNotificationsNumber(page);
      expect(notificationsNumber).to.be.equal(0);
    });

    it(`should search for the product '${dataProducts.demo_6.name}'`, async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'searchProduct_2', baseContext);

      await foDefaultHomePage.searchProduct(page, dataProducts.demo_6.name);

      const pageTitle = await foDefaultSearchResultsPage.getPageTitle(page);
      expect(pageTitle).to.equal(foDefaultSearchResultsPage.pageTitle);
    });

    it('should go to the product page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToProductPage_2', baseContext);

      await foDefaultSearchResultsPage.goToProductPage(page, 1);

      const pageTitle = await foDefaultProductPage.getPageTitle(page);
      expect(pageTitle).to.contains(dataProducts.demo_6.name);
    });

    it('should check the discount', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkDiscount_2', baseContext);

      // Check discount
      const columnValue = await foDefaultProductPage.getDiscountAmount(page);
      expect(columnValue).to.equal(`(Save €${catalogPriceRuleData.reduction.toFixed(2)})`);

      // Check final price
      const finalPrice = await foDefaultProductPage.getProductInformation(page);
      expect(finalPrice.price.toFixed(2)).to.equal(
        (
          dataProducts.demo_6.combinations[0].priceTI - catalogPriceRuleData.reduction
        ).toFixed(2),
      );
    });

    it('should add the product to the cart', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addProductToCart_2', baseContext);

      await foDefaultProductPage.addProductToTheCart(page);

      const pageTitle = await foDefaultCartPage.getPageTitle(page);
      expect(pageTitle).to.equal(foDefaultCartPage.pageTitle);
    });

    it('should check the discount in cart page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkDiscountInTheCart_2', baseContext);

      const productDetail = await foDefaultCartPage.getProductDetail(page, 1);
      await Promise.all([
        expect(productDetail.regularPrice).to.equal(dataProducts.demo_6.combinations[0].priceTI),
        expect(productDetail.price.toFixed(2)).to.equal(
          (
            dataProducts.demo_6.combinations[0].priceTI - catalogPriceRuleData.reduction
          ).toFixed(2),
        ),
        expect(productDetail.discountAmount).to.equal(`-€${catalogPriceRuleData.reduction.toFixed(2)}`),
      ]);
    });
  });

  describe('Edit catalog price rules and check it in FO - Group : All groups', async () => {
    it('should go back to BO', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goBackToBO_2', baseContext);

      page = await foDefaultCartPage.changePage(browserContext, 0);

      const pageTitle = await boCatalogPriceRulesPage.getPageTitle(page);
      expect(pageTitle).to.contains(boCatalogPriceRulesPage.pageTitle);
    });

    it('should edit the catalog price rules', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'editCatalogPriceRules_2', baseContext);

      await boCatalogPriceRulesPage.goToEditCatalogPriceRulePage(page, editCatalogPriceRuleData.name);

      const pageTitle = await boCatalogPriceRulesCreatePage.getPageTitle(page);
      expect(pageTitle).to.contains(boCatalogPriceRulesCreatePage.editPageTitle);

      const validationMessage = await boCatalogPriceRulesCreatePage.setCatalogPriceRule(page, editCatalogPriceRuleData2);
      expect(validationMessage).to.contains(boCatalogPriceRulesPage.successfulUpdateMessage);
    });

    it('should go back to FO', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goBackToFO_2', baseContext);

      page = await boCatalogPriceRulesCreatePage.changePage(browserContext, 1);

      const pageTitle = await foDefaultCartPage.getPageTitle(page);
      expect(pageTitle).to.contains(foDefaultCartPage.pageTitle);
    });

    it('should refresh and check the discount', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkDiscountInTheCart_3', baseContext);

      await foDefaultCartPage.reloadPage(page);

      const productDetail = await foDefaultCartPage.getProductDetail(page, 1);
      await Promise.all([
        expect(productDetail.regularPrice).to.equal(dataProducts.demo_6.combinations[0].priceTI),
        expect(productDetail.price.toFixed(2)).to.equal(
          (
            dataProducts.demo_6.combinations[0].priceTI - catalogPriceRuleData.reduction
          ).toFixed(2),
        ),
        expect(productDetail.discountAmount).to.equal(`-€${catalogPriceRuleData.reduction.toFixed(2)}`),
      ]);
    });

    it('should login with the default customer', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'loginCustomer', baseContext);

      await foDefaultHomePage.goToLoginPage(page);
      await foDefaultLoginPage.customerLogin(page, dataCustomers.johnDoe);

      const connected = await foDefaultHomePage.isCustomerConnected(page);
      expect(connected, 'Customer is not connected in FO').to.eq(true);
    });

    it('should check the discount', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkDiscountInTheCart_4', baseContext);

      const productDetail = await foDefaultCartPage.getProductDetail(page, 1);
      await Promise.all([
        expect(productDetail.regularPrice).to.equal(dataProducts.demo_6.combinations[0].priceTI),
        expect(productDetail.price.toFixed(2)).to.equal(
          (
            dataProducts.demo_6.combinations[0].priceTI - catalogPriceRuleData.reduction
          ).toFixed(2),
        ),
        expect(productDetail.discountAmount).to.equal(`-€${catalogPriceRuleData.reduction.toFixed(2)}`),
      ]);
    });
  });

  describe('Delete created catalog price rules', async () => {
    it('should go back to BO', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goBackToBO_3', baseContext);

      page = await foDefaultCartPage.changePage(browserContext, 0);

      const pageTitle = await boCatalogPriceRulesPage.getPageTitle(page);
      expect(pageTitle).to.contains(boCatalogPriceRulesPage.pageTitle);
    });

    it('should delete catalog price rule', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'deleteCatalogPriceRule', baseContext);

      const deleteTextResult = await boCatalogPriceRulesPage.deleteCatalogPriceRule(page, editCatalogPriceRuleData2.name);
      expect(deleteTextResult).to.contains(boCatalogPriceRulesPage.successfulDeleteMessage);
    });
  });
});
