// Import utils
import testContext from '@utils/testContext';

// Import commonTests
import {createProductTest, deleteProductTest} from '@commonTests/BO/catalog/product';
import {disableModule, enableModule} from '@commonTests/BO/modules/moduleManager';

import {
  foDefaultHomePage,
  foDefaultLoginPage,
  foDefaultModalWishlistPage,
  foDefaultMyAccountPage,
  foDefaultMyWishlistsPage,
  foDefaultMyWishlistsViewPage,
  foDefaultProductPage,
  foDefaultSearchResultsPage,
} from '@utils/foDefaultPages';

import {
  type BrowserContext,
  dataCustomers,
  dataProducts,
  FakerProduct,
  type Page,
  utilsPlaywright,
  dataModules,
} from '@prestashop-core/ui-testing';

import {expect} from 'chai';

const baseContext: string = 'modules_blockwishlist_frontOffice_products_addProductToList';

describe('Wishlist module - Add a product to a list', async () => {
  const productOutOfStockNotAllowed: FakerProduct = new FakerProduct({
    name: 'Product Out of stock not allowed',
    type: 'standard',
    taxRule: 'No tax',
    tax: 0,
    quantity: 0,
    behaviourOutOfStock: 'Deny orders',
  });
  const productLowStock: FakerProduct = new FakerProduct({
    name: 'Product Low Stock',
    type: 'standard',
    taxRule: 'No tax',
    tax: 0,
    quantity: 2,
  });

  // PRE-TEST : Create product out of stock not allowed
  createProductTest(productOutOfStockNotAllowed, `${baseContext}_preTest_0`);

  // PRE-TEST : Create product with a low stock
  createProductTest(productLowStock, `${baseContext}_preTest_1`);

  // PRE-TEST : Enable Blockwishlist
  enableModule(dataModules.blockwishlist, `${baseContext}_preTest_2`);

  describe('Add a product to a list', async () => {
    let browserContext: BrowserContext;
    let page: Page;
    let wishlistName: string;

    before(async function () {
      browserContext = await utilsPlaywright.createBrowserContext(this.browser);
      page = await utilsPlaywright.newTab(browserContext);
    });

    after(async () => {
      await utilsPlaywright.closeBrowserContext(browserContext);
    });

    it('should open the shop page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToShopFO', baseContext);

      await foDefaultHomePage.goTo(page, global.FO.URL);

      const isHomePage = await foDefaultHomePage.isHomePage(page);
      expect(isHomePage).to.eq(true);
    });

    it('should go the product page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToProductPage', baseContext);

      await foDefaultHomePage.goToProductPage(page, 1);

      const productInformations = await foDefaultProductPage.getProductInformation(page);
      expect(productInformations.name).to.eq(dataProducts.demo_1.name);
    });

    it('should click on the button "Add to wishlist" and cancel', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'clickAddToWishlistAndCancel', baseContext);

      await foDefaultProductPage.clickAddToWishlistButton(page);

      const hasModalLogin = await foDefaultModalWishlistPage.hasModalLogin(page);
      expect(hasModalLogin).to.equal(true);

      const isModalVisible = await foDefaultModalWishlistPage.clickCancelOnModalLogin(page);
      expect(isModalVisible).to.equal(false);
    });

    it('should click on the button "Add to wishlist" and login', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'clickAddToWishlistAndLogin', baseContext);

      await foDefaultProductPage.clickAddToWishlistButton(page);

      const hasModalLogin = await foDefaultModalWishlistPage.hasModalLogin(page);
      expect(hasModalLogin).to.equal(true);

      await foDefaultModalWishlistPage.clickLoginOnModalLogin(page);

      const pageTitle = await foDefaultLoginPage.getPageTitle(page);
      expect(pageTitle).to.contains(foDefaultLoginPage.pageTitle);
    });

    it('should login', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'foLogin', baseContext);

      await foDefaultLoginPage.customerLogin(page, dataCustomers.johnDoe);

      const isCustomerConnected = await foDefaultLoginPage.isCustomerConnected(page);
      expect(isCustomerConnected).to.eq(true);
    });

    it('should go to "My Account" page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToMyAccount1', baseContext);

      await foDefaultHomePage.goToMyAccountPage(page);

      const pageTitle = await foDefaultMyAccountPage.getPageTitle(page);
      expect(pageTitle).to.contains(foDefaultMyAccountPage.pageTitle);
    });

    it('should go to "My wishlists" page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToMyWishlists1', baseContext);

      await foDefaultMyAccountPage.goToMyWishlistsPage(page);

      const pageTitle = await foDefaultMyWishlistsPage.getPageTitle(page);
      expect(pageTitle).to.contains(foDefaultMyWishlistsPage.pageTitle);

      wishlistName = await foDefaultMyWishlistsPage.getWishlistName(page, 1);
    });

    it('should click on the first wishlist', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'clickFirstWishlist1', baseContext);

      await foDefaultMyWishlistsPage.goToWishlistPage(page, 1);

      const pageTitle = await foDefaultMyWishlistsViewPage.getPageTitle(page);
      expect(pageTitle).to.contains(wishlistName);
    });

    it('should check the wishlist', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkWishlist1', baseContext);

      const numProducts = await foDefaultMyWishlistsViewPage.countProducts(page);
      expect(numProducts).to.equal(0);
    });

    it(`should search the product ${dataProducts.demo_3.name}`, async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'searchProductDemo3', baseContext);

      await foDefaultMyWishlistsViewPage.searchProduct(page, dataProducts.demo_3.name);
      await foDefaultSearchResultsPage.goToProductPage(page, 1);

      const pageTitle = await foDefaultProductPage.getPageTitle(page);
      expect(pageTitle).to.equal(dataProducts.demo_3.name);

      await foDefaultProductPage.setQuantityByArrowUpDown(page, 5, 'increment');
    });

    it('should add to the wishlist and select the first wishlist', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addToWishlist1', baseContext);

      await foDefaultProductPage.clickAddToWishlistButton(page);

      const textResult = await foDefaultModalWishlistPage.addWishlist(page, 1);
      expect(textResult).to.equal(foDefaultModalWishlistPage.messageAddedToWishlist);
    });

    it('should go to "My Account" page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToMyAccount2', baseContext);

      await foDefaultHomePage.goToMyAccountPage(page);

      const pageTitle = await foDefaultMyAccountPage.getPageTitle(page);
      expect(pageTitle).to.contains(foDefaultMyAccountPage.pageTitle);
    });

    it('should go to "My wishlists" page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToMyWishlists2', baseContext);

      await foDefaultMyAccountPage.goToMyWishlistsPage(page);

      const pageTitle = await foDefaultMyWishlistsPage.getPageTitle(page);
      expect(pageTitle).to.contains(foDefaultMyWishlistsPage.pageTitle);
    });

    it('should click on the first wishlist', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'clickFirstWishlist2', baseContext);

      await foDefaultMyWishlistsPage.goToWishlistPage(page, 1);

      const pageTitle = await foDefaultMyWishlistsViewPage.getPageTitle(page);
      expect(pageTitle).to.contains(wishlistName);
    });

    it('should check the wishlist', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkWishlist2', baseContext);

      const numProducts = await foDefaultMyWishlistsViewPage.countProducts(page);
      expect(numProducts).to.equal(1);

      const nameProduct = await foDefaultMyWishlistsViewPage.getProductName(page, 1);
      expect(nameProduct).to.equal(dataProducts.demo_3.name);

      const qtyProduct = await foDefaultMyWishlistsViewPage.getProductQuantity(page, 1);
      expect(qtyProduct).to.equal(5);

      const sizeProduct = await foDefaultMyWishlistsViewPage.getProductAttribute(page, 1, 'Size');
      expect(sizeProduct).to.equal('S');
    });

    it(`should search the product ${productOutOfStockNotAllowed.name}`, async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'searchProductOutOfStockNotAllowed', baseContext);

      await foDefaultMyWishlistsViewPage.searchProduct(page, productOutOfStockNotAllowed.name);
      await foDefaultSearchResultsPage.goToProductPage(page, 1);

      const pageTitle = await foDefaultProductPage.getPageTitle(page);
      expect(pageTitle).to.equal(productOutOfStockNotAllowed.name);
    });

    it('should add to the wishlist and select the first wishlist', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addToWishlist2', baseContext);

      await foDefaultProductPage.clickAddToWishlistButton(page);

      const textResult = await foDefaultModalWishlistPage.addWishlist(page, 1);
      expect(textResult).to.equal(foDefaultModalWishlistPage.messageAddedToWishlist);
    });

    it('should go to "My Account" page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToMyAccount3', baseContext);

      await foDefaultHomePage.goToMyAccountPage(page);

      const pageTitle = await foDefaultMyAccountPage.getPageTitle(page);
      expect(pageTitle).to.contains(foDefaultMyAccountPage.pageTitle);
    });

    it('should go to "My wishlists" page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToMyWishlists3', baseContext);

      await foDefaultMyAccountPage.goToMyWishlistsPage(page);

      const pageTitle = await foDefaultMyWishlistsPage.getPageTitle(page);
      expect(pageTitle).to.contains(foDefaultMyWishlistsPage.pageTitle);
    });

    it('should click on the first wishlist', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'clickFirstWishlist3', baseContext);

      await foDefaultMyWishlistsPage.goToWishlistPage(page, 1);

      const pageTitle = await foDefaultMyWishlistsViewPage.getPageTitle(page);
      expect(pageTitle).to.contains(wishlistName);
    });

    it('should check the wishlist', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkWishlist3', baseContext);

      const numProducts = await foDefaultMyWishlistsViewPage.countProducts(page);
      expect(numProducts).to.equal(2);

      const nameProduct = await foDefaultMyWishlistsViewPage.getProductName(page, 2);
      expect(nameProduct).to.equal(productOutOfStockNotAllowed.name);

      const qtyProduct = await foDefaultMyWishlistsViewPage.getProductQuantity(page, 2);
      expect(qtyProduct).to.equal(1);

      const isProductOutOfStock = await foDefaultMyWishlistsViewPage.isProductOutOfStock(page, 2);
      expect(isProductOutOfStock).to.equal(true);

      const hasButtonAddToCartDisabled = await foDefaultMyWishlistsViewPage.hasButtonAddToCartDisabled(page, 2);
      expect(hasButtonAddToCartDisabled).to.equal(true);
    });

    it(`should search the product ${productLowStock.name}`, async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'searchProductLowStock', baseContext);

      await foDefaultMyWishlistsViewPage.searchProduct(page, productLowStock.name);
      await foDefaultSearchResultsPage.goToProductPage(page, 1);

      const pageTitle = await foDefaultProductPage.getPageTitle(page);
      expect(pageTitle).to.equal(productLowStock.name);
    });

    it('should add to the wishlist and select the first wishlist', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addToWishlist3', baseContext);

      await foDefaultProductPage.clickAddToWishlistButton(page);

      const textResult = await foDefaultModalWishlistPage.addWishlist(page, 1);
      expect(textResult).to.equal(foDefaultModalWishlistPage.messageAddedToWishlist);
    });

    it('should go to "My Account" page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToMyAccount4', baseContext);

      await foDefaultHomePage.goToMyAccountPage(page);

      const pageTitle = await foDefaultMyAccountPage.getPageTitle(page);
      expect(pageTitle).to.contains(foDefaultMyAccountPage.pageTitle);
    });

    it('should go to "My wishlists" page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToMyWishlists4', baseContext);

      await foDefaultMyAccountPage.goToMyWishlistsPage(page);

      const pageTitle = await foDefaultMyWishlistsPage.getPageTitle(page);
      expect(pageTitle).to.contains(foDefaultMyWishlistsPage.pageTitle);
    });

    it('should click on the first wishlist', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'clickFirstWishlist4', baseContext);

      await foDefaultMyWishlistsPage.goToWishlistPage(page, 1);

      const pageTitle = await foDefaultMyWishlistsViewPage.getPageTitle(page);
      expect(pageTitle).to.contains(wishlistName);
    });

    it('should check the wishlist', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkWishlist4', baseContext);

      const numProducts = await foDefaultMyWishlistsViewPage.countProducts(page);
      expect(numProducts).to.equal(3);

      const nameProduct = await foDefaultMyWishlistsViewPage.getProductName(page, 3);
      expect(nameProduct).to.equal(productLowStock.name);

      const qtyProduct = await foDefaultMyWishlistsViewPage.getProductQuantity(page, 2);
      expect(qtyProduct).to.equal(1);

      const isProductLastItemsInStock = await foDefaultMyWishlistsViewPage.isProductLastItemsInStock(page, 3);
      expect(isProductLastItemsInStock).to.equal(true);
    });

    it(`should search the product ${dataProducts.demo_1.name}`, async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'searchProductDemo1', baseContext);

      await foDefaultMyWishlistsViewPage.searchProduct(page, dataProducts.demo_1.name);
      await foDefaultSearchResultsPage.goToProductPage(page, 1);

      const pageTitle = await foDefaultProductPage.getPageTitle(page);
      expect(pageTitle).to.equal(dataProducts.demo_1.name);
    });

    it('should select the size \'M\' and check it', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'selectSize', baseContext);

      await foDefaultProductPage.selectAttributes(page, 'select', [{name: 'size', value: 'M'}]);

      const selectedAttributeSize = await foDefaultProductPage.getSelectedAttribute(page, 1, 'select');
      expect(selectedAttributeSize).to.equal('M');
    });

    it('should select the color "Black" and check it', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'selectColor', baseContext);

      await foDefaultProductPage.selectAttributes(page, 'radio', [{name: 'Color', value: 'Black'}], 2);

      const selectedAttributeColor = await foDefaultProductPage.getSelectedAttribute(page, 2, 'radio');
      expect(selectedAttributeColor).to.equal('Color - Black');
    });

    it('should add to the wishlist and select the first wishlist', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addToWishlist4', baseContext);

      await foDefaultProductPage.clickAddToWishlistButton(page);

      const textResult = await foDefaultModalWishlistPage.addWishlist(page, 1);
      expect(textResult).to.equal(foDefaultModalWishlistPage.messageAddedToWishlist);
    });

    it('should go to "My Account" page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToMyAccount5', baseContext);

      await foDefaultHomePage.goToMyAccountPage(page);

      const pageTitle = await foDefaultMyAccountPage.getPageTitle(page);
      expect(pageTitle).to.contains(foDefaultMyAccountPage.pageTitle);
    });

    it('should go to "My wishlists" page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToMyWishlists5', baseContext);

      await foDefaultMyAccountPage.goToMyWishlistsPage(page);

      const pageTitle = await foDefaultMyWishlistsPage.getPageTitle(page);
      expect(pageTitle).to.contains(foDefaultMyWishlistsPage.pageTitle);
    });

    it('should click on the first wishlist', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'clickFirstWishlist5', baseContext);

      await foDefaultMyWishlistsPage.goToWishlistPage(page, 1);

      const pageTitle = await foDefaultMyWishlistsViewPage.getPageTitle(page);
      expect(pageTitle).to.contains(wishlistName);
    });

    // @todo : https://github.com/PrestaShop/PrestaShop/issues/36496
    it('should check the wishlist', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkWishlist5', baseContext);

      const numProducts = await foDefaultMyWishlistsViewPage.countProducts(page);
      expect(numProducts).to.equal(4);

      // const nameProduct = await foDefaultMyWishlistsViewPage.getProductName(page, 4);
      const nameProduct = await foDefaultMyWishlistsViewPage.getProductName(page, 2);
      expect(nameProduct).to.equal(dataProducts.demo_1.name);

      //const qtyProduct = await foDefaultMyWishlistsViewPage.getProductQuantity(page, 4);
      const qtyProduct = await foDefaultMyWishlistsViewPage.getProductQuantity(page, 2);
      expect(qtyProduct).to.equal(1);

      //const sizeProduct = await foDefaultMyWishlistsViewPage.getProductAttribute(page, 4, 'Size');
      //const sizeProduct = await foDefaultMyWishlistsViewPage.getProductAttribute(page, 2, 'Size');
      //expect(sizeProduct).to.equal('M');

      //const colorProduct = await foDefaultMyWishlistsViewPage.getProductAttribute(page, 4, 'Color');
      //const colorProduct = await foDefaultMyWishlistsViewPage.getProductAttribute(page, 2, 'Color');
      //expect(colorProduct).to.equal('Black');
    });

    it('should empty the wishlist', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'emptyWishlist', baseContext);

      for (let idxProduct = 1; idxProduct <= 4; idxProduct++) {
        const message = await foDefaultMyWishlistsViewPage.removeProduct(page, 1);
        expect(message).to.equal(foDefaultMyWishlistsViewPage.messageSuccessfullyRemoved);
      }

      const numProducts = await foDefaultMyWishlistsViewPage.countProducts(page);
      expect(numProducts).to.equal(0);
    });
  });

  deleteProductTest(productOutOfStockNotAllowed, `${baseContext}_postTest_0`);

  deleteProductTest(productLowStock, `${baseContext}_postTest_1`);

  // POST-TEST : Disable Blockwishlist
  disableModule(dataModules.blockwishlist, `${baseContext}_postTest_2`);
});
