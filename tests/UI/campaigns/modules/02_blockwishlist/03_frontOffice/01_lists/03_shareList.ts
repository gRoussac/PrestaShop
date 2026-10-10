// Import utils
import testContext from '@utils/testContext';

import {
  foDefaultHomePage,
  foDefaultLoginPage,
  foDefaultModalWishlistPage,
  foDefaultMyAccountPage,
  foDefaultMyWishlistsPage,
  foDefaultMyWishlistsViewPage,
} from '@utils/foDefaultPages';

import {
  type BrowserContext,
  dataCustomers,
  dataModules,
  type Page,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

import {expect} from 'chai';
import {disableModule, enableModule, resetModule} from '@commonTests/BO/modules/moduleManager';

const baseContext: string = 'modules_blockwishlist_frontOffice_lists_shareList';

describe('Wishlist module - Share a list', async () => {
  // PRE-TEST : Enable Blockwishlist
  enableModule(dataModules.blockwishlist, `${baseContext}_preTest_0`);

  describe('Share a list', async () => {
    const wishlistName: string = 'Ma liste de souhaits';

    let browserContext: BrowserContext;
    let page: Page;
    let wishlistUrl: string;

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

    it('should go to login page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToLoginFO', baseContext);

      await foDefaultHomePage.goToLoginPage(page);

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

    it('should go to "My Wishlists" page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToMyWishlists1', baseContext);

      await foDefaultMyAccountPage.goToMyWishlistsPage(page);

      const pageTitle = await foDefaultMyWishlistsPage.getPageTitle(page);
      expect(pageTitle).to.contains(foDefaultMyWishlistsPage.pageTitle);
    });

    it('should click on the share icon and cancel the modal', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'clickShareAndCancel', baseContext);

      await foDefaultMyWishlistsPage.clickShareWishlistButton(page, 1);

      const hasModalShare = await foDefaultModalWishlistPage.hasModalShare(page);
      expect(hasModalShare).to.equal(true);

      const isModalVisible = await foDefaultModalWishlistPage.clickCancelOnModalShare(page);
      expect(isModalVisible).to.equal(false);
    });

    it('should click on the share icon and copy the text', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'clickShareAndCopyText', baseContext);

      await foDefaultMyWishlistsPage.clickShareWishlistButton(page, 1);

      const hasModalLogin = await foDefaultModalWishlistPage.hasModalShare(page);
      expect(hasModalLogin).to.equal(true);

      const textToast = await foDefaultModalWishlistPage.clickShareOnModalShare(page);
      expect(textToast).to.equal(foDefaultModalWishlistPage.messageLinkSharedWishlist);
    });

    it('should click on the Create new list link and cancel', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'createNewListAndCancel', baseContext);

      await foDefaultMyWishlistsPage.clickCreateWishlistButton(page);

      const hasModalCreate = await foDefaultModalWishlistPage.hasModalCreate(page);
      expect(hasModalCreate).to.equal(true);

      const isModalVisible = await foDefaultModalWishlistPage.clickCancelOnModalCreate(page);
      expect(isModalVisible).to.equal(false);
    });

    it('should click on the Create new list link and create it', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'createNewListAndCreate', baseContext);

      await foDefaultMyWishlistsPage.clickCreateWishlistButton(page);

      const hasModalCreate = await foDefaultModalWishlistPage.hasModalCreate(page);
      expect(hasModalCreate).to.equal(true);

      await foDefaultModalWishlistPage.setNameOnModalCreate(page, wishlistName);

      const textToast = await foDefaultModalWishlistPage.clickCreateOnModalCreate(page);
      expect(textToast).to.equal(foDefaultModalWishlistPage.messageWishlistCreated);
    });

    it('should click on the share icon (in dropdown) and cancel the modal', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'clickDropdownShareAndCancel', baseContext);

      await foDefaultMyWishlistsPage.clickShareWishlistButton(page, 2);

      const hasModalShare = await foDefaultModalWishlistPage.hasModalShare(page);
      expect(hasModalShare).to.equal(true);

      const isModalVisible = await foDefaultModalWishlistPage.clickCancelOnModalShare(page);
      expect(isModalVisible).to.equal(false);
    });

    it('should click on the share icon (in dropdown) and copy the text', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'clickDropdownShareAndCopyText', baseContext);

      await foDefaultMyWishlistsPage.clickShareWishlistButton(page, 2);

      const hasModalLogin = await foDefaultModalWishlistPage.hasModalShare(page);
      expect(hasModalLogin).to.equal(true);

      const textToast = await foDefaultModalWishlistPage.clickShareOnModalShare(page);
      expect(textToast).to.equal(foDefaultModalWishlistPage.messageLinkSharedWishlist);

      wishlistUrl = await foDefaultMyWishlistsPage.getClipboardText(page);
      expect(wishlistUrl).to.be.a('string');
      expect(wishlistUrl.length).to.be.gt(0);
    });

    it('should go to the shared wishlist', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToSharedWishlistLogged', baseContext);

      await foDefaultMyWishlistsPage.goTo(page, wishlistUrl);

      const pageTitle = await foDefaultMyWishlistsViewPage.getPageTitle(page);
      expect(pageTitle).to.contains(wishlistName);

      const numProducts = await foDefaultMyWishlistsViewPage.countProducts(page);
      expect(numProducts).to.equal(0);
    });

    it('should logout', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'logout', baseContext);

      await foDefaultMyWishlistsViewPage.logout(page);
      await foDefaultMyWishlistsViewPage.clickOnHeaderLink(page, 'Logo');

      const isCustomerConnected = await foDefaultLoginPage.isCustomerConnected(page);
      expect(isCustomerConnected).to.eq(false);
    });

    it('should return to the shared wishlist', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToSharedWishlistUnlogged', baseContext);

      await foDefaultLoginPage.goTo(page, wishlistUrl);

      const pageTitle = await foDefaultMyWishlistsViewPage.getPageTitle(page);
      expect(pageTitle).to.contains(wishlistName);

      const numProducts = await foDefaultMyWishlistsViewPage.countProducts(page);
      expect(numProducts).to.equal(0);
    });
  });

  resetModule(dataModules.blockwishlist, `${baseContext}_postTest_0`);

  // POST-TEST : Disable Blockwishlist
  disableModule(dataModules.blockwishlist, `${baseContext}_postTest_1`);
});
