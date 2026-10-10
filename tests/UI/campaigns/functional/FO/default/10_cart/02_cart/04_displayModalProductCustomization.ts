import testContext from '@utils/testContext';
import {expect} from 'chai';

import {
  foDefaultCartPage,
  foDefaultHomePage,
  foDefaultModalBlockCartPage,
  foDefaultProductPage,
  foDefaultSearchResultsPage,
} from '@utils/foDefaultPages';

import {
  type BrowserContext,
  dataProducts,
  type Page,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_FO_default_cart_cart_displayModalProductCustomization';

describe('FO - Cart : Display modal of product customization', async () => {
  let browserContext: BrowserContext;
  let page: Page;
  const customText: string = 'Hello world!';

  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  describe('Display modal of product customization', async () => {
    it('should open the shop page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToFo', baseContext);

      await foDefaultHomePage.goToFo(page);
      await foDefaultHomePage.changeLanguage(page, 'en');

      const isHomePage = await foDefaultHomePage.isHomePage(page);
      expect(isHomePage).to.eq(true);
    });

    it(`should search for the product '${dataProducts.demo_14.name}'`, async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'searchProduct', baseContext);

      await foDefaultHomePage.searchProduct(page, dataProducts.demo_14.name);

      const pageTitle = await foDefaultSearchResultsPage.getPageTitle(page);
      expect(pageTitle).to.equal(foDefaultSearchResultsPage.pageTitle);
    });

    it('should go to the product page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToProductPage', baseContext);

      await foDefaultSearchResultsPage.goToProductPage(page, 1);

      const pageTitle = await foDefaultProductPage.getPageTitle(page);
      expect(pageTitle).to.contains(dataProducts.demo_14.name);
    });

    it('should add custom text and add the product to cart', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addProductToCart', baseContext);

      await foDefaultProductPage.setProductCustomizations(page, [customText]);

      await foDefaultProductPage.clickOnAddToCartButton(page);

      const isBlockCartModal = await foDefaultModalBlockCartPage.isBlockCartModalVisible(page);
      expect(isBlockCartModal).to.equal(true);

      const successMessage = await foDefaultModalBlockCartPage.getBlockCartModalTitle(page);
      expect(successMessage).to.contains(foDefaultHomePage.successAddToCartMessage);
    });

    it('should click on continue shopping button', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'continueShopping', baseContext);

      const isModalNotVisible = await foDefaultModalBlockCartPage.continueShopping(page);
      expect(isModalNotVisible).to.equal(true);
    });

    it('should go to the cart page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToCartPage', baseContext);

      await foDefaultProductPage.goToCartPage(page);

      const pageTitle = await foDefaultCartPage.getPageTitle(page);
      expect(pageTitle).to.equal(foDefaultCartPage.pageTitle);
    });

    it('should click on product customization and check the modal', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'clickCustomization', baseContext);

      const isModalVisible = await foDefaultCartPage.clickOnProductCustomization(page, 1);
      expect(isModalVisible).to.equal(true);
    });

    it('should check the customization modal content', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'getModalContent', baseContext);

      const modalContent = await foDefaultCartPage.getProductCustomizationModal(page);
      expect(modalContent).to.equal(`Type your text here ${customText}`);
    });

    it('should close the modal', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'closeModal', baseContext);

      const isModalNotVisible = await foDefaultCartPage.closeProductCustomizationModal(page, 1);
      expect(isModalNotVisible).to.equal(true);
    });
  });
});
