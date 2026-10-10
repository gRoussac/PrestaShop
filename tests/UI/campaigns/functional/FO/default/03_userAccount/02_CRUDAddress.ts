import testContext from '@utils/testContext';
import {expect} from 'chai';

import {deleteCustomerTest} from '@commonTests/BO/customers/customer';
import {createAccountTest} from '@commonTests/FO/default/account';

import {
  foDefaultCartPage,
  foDefaultCheckoutPage,
  foDefaultHomePage,
  foDefaultLoginPage,
  foDefaultMyAccountPage,
  foDefaultMyAddressesPage,
  foDefaultMyAddressesCreatePage,
  foDefaultProductPage,
} from '@utils/foDefaultPages';

import {
  type BrowserContext,
  dataProducts,
  FakerAddress,
  FakerCustomer,
  type Page,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_FO_default_userAccount_CRUDAddress';

/*
Pre-condition:
- Create account test
Scenario:
- Create first address
- Edit address
- Create second address
- Add a product to cart
- Try to delete first address and check error message
- go to checkout page and choose the second address
- Delete the first address and check success message
Post-condition:
- Delete customer account
 */
describe('FO - Account : CRUD address', async () => {
  let browserContext: BrowserContext;
  let page: Page;
  let firstAddressPosition: number = 0;
  let secondAddressPosition: number = 0;

  const newCustomerData: FakerCustomer = new FakerCustomer();
  const createAddressData: FakerAddress = new FakerAddress({country: 'France'});
  const editAddressData: FakerAddress = new FakerAddress({country: 'France'});
  const secondAddressData: FakerAddress = new FakerAddress({country: 'France'});

  // Pre-condition
  createAccountTest(newCustomerData, `${baseContext}_preTest_1`);

  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  describe('Go to \'Add first address\' page and create address', async () => {
    it('should go to FO home page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToFoHomePage', baseContext);

      await foDefaultHomePage.goToFo(page);

      const isHomePage = await foDefaultHomePage.isHomePage(page);
      expect(isHomePage).to.eq(true);
    });

    it('should go to login page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToLoginFoPage', baseContext);

      await foDefaultHomePage.goToLoginPage(page);

      const pageHeaderTitle = await foDefaultLoginPage.getPageTitle(page);
      expect(pageHeaderTitle).to.equal(foDefaultLoginPage.pageTitle);
    });

    it('Should sign in FO', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'signInFo', baseContext);

      await foDefaultLoginPage.customerLogin(page, newCustomerData);

      const isCustomerConnected = await foDefaultMyAccountPage.isCustomerConnected(page);
      expect(isCustomerConnected, 'Customer is not connected').to.eq(true);
    });

    it('should go to \'My Account\' page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToMyAccountPage', baseContext);

      await foDefaultHomePage.goToMyAccountPage(page);

      const pageHeaderTitle = await foDefaultMyAccountPage.getPageTitle(page);
      expect(pageHeaderTitle).to.equal(foDefaultMyAccountPage.pageTitle);
    });

    it('should go to \'Add first address\' page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToAddFirstAddressPage', baseContext);

      await foDefaultMyAccountPage.goToAddressesPage(page);

      const pageHeaderTitle = await foDefaultMyAddressesPage.getPageTitle(page);
      expect(pageHeaderTitle).to.equal(foDefaultMyAddressesPage.addressPageTitle);
    });

    it('should create new address', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'createAddress', baseContext);

      const textResult = await foDefaultMyAddressesCreatePage.setAddress(page, createAddressData);
      expect(textResult).to.equal(foDefaultMyAddressesPage.addAddressSuccessfulMessage);
    });
  });

  describe('Update the created address on FO', async () => {
    it('should go to edit address page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToEditAddressPage', baseContext);

      const addressPosition = await foDefaultMyAddressesPage.getAddressPosition(page, createAddressData.alias);
      await foDefaultMyAddressesPage.goToEditAddressPage(page, addressPosition);

      const pageHeaderTitle = await foDefaultMyAddressesCreatePage.getHeaderTitle(page);
      expect(pageHeaderTitle).to.equal(foDefaultMyAddressesCreatePage.updateFormTitle);
    });

    it('should update the address', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'updateAddress', baseContext);

      const textResult = await foDefaultMyAddressesCreatePage.setAddress(page, editAddressData);
      expect(textResult).to.equal(foDefaultMyAddressesPage.updateAddressSuccessfulMessage);
    });

    it('should go back to \'Your account page\'', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goBackYourAccountPage', baseContext);

      await foDefaultMyAddressesCreatePage.clickOnBreadCrumbLink(page, 'my-account');

      const pageHeaderTitle = await foDefaultMyAccountPage.getPageTitle(page);
      expect(pageHeaderTitle).to.equal(foDefaultMyAccountPage.pageTitle);
    });

    it('should check that \'Add first address\' is changed to \'Addresses\'', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkAddFirstAddress', baseContext);

      const isAddFirstAddressLinkVisible = await foDefaultMyAccountPage.isAddFirstAddressLinkVisible(page);
      expect(isAddFirstAddressLinkVisible, 'Add first address link is still visible!').to.eq(false);
    });
  });

  describe('Create a second address', async () => {
    it('should go to \'Addresses\' page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToAddressesPage', baseContext);

      await foDefaultMyAccountPage.goToAddressesPage(page);

      const pageHeaderTitle = await foDefaultMyAddressesPage.getPageTitle(page);
      expect(pageHeaderTitle).to.equal(foDefaultMyAddressesPage.pageTitle);
    });

    it('should go to \'Create new address\' page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToNewAddressPage', baseContext);

      await foDefaultMyAddressesPage.openNewAddressForm(page);

      const pageHeaderTitle = await foDefaultMyAddressesCreatePage.getHeaderTitle(page);
      expect(pageHeaderTitle).to.equal(foDefaultMyAddressesCreatePage.creationFormTitle);
    });

    it('should create new address', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'createAddress2', baseContext);

      const textResult = await foDefaultMyAddressesCreatePage.setAddress(page, secondAddressData);
      expect(textResult).to.equal(foDefaultMyAddressesPage.addAddressSuccessfulMessage);
    });
  });

  describe('Add a product to cart and check the created addresses', async () => {
    it('should go to home page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToHomePage', baseContext);

      await foDefaultHomePage.goToHomePage(page);

      const isHomePage = await foDefaultHomePage.isHomePage(page);
      expect(isHomePage, 'Home page is not displayed').to.eq(true);
    });

    it('should go to product page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToProductPage', baseContext);

      await foDefaultHomePage.goToProductPage(page, 1);

      const pageTitle = await foDefaultProductPage.getPageTitle(page);
      expect(pageTitle).to.contains(dataProducts.demo_1.name);
    });

    it('should add product to the cart', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addProductToCart', baseContext);

      await foDefaultProductPage.addProductToTheCart(page);

      const notificationsNumber = await foDefaultCartPage.getCartNotificationsNumber(page);
      expect(notificationsNumber).to.be.equal(1);
    });

    it('should check that the two created addresses are displayed', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkCreatedAddresses1', baseContext);

      // Proceed to checkout the shopping cart
      await foDefaultCartPage.clickOnProceedToCheckout(page);

      const addressesNumber = await foDefaultCheckoutPage.getNumberOfAddresses(page);
      expect(addressesNumber, 'The addresses number is not equal to 2!').to.equal(2);
    });
  });

  describe('Delete the address on FO', async () => {
    it('should go to home page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToHomePageToDeleteAddress', baseContext);

      await foDefaultHomePage.goToHomePage(page);

      const isHomePage = await foDefaultHomePage.isHomePage(page);
      expect(isHomePage, 'Home page is not displayed').to.eq(true);
    });

    it('should go to \'My Account\' page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToMyAccountPageToDeleteAddress', baseContext);

      await foDefaultHomePage.goToMyAccountPage(page);

      const pageHeaderTitle = await foDefaultMyAccountPage.getPageTitle(page);
      expect(pageHeaderTitle).to.equal(foDefaultMyAccountPage.pageTitle);
    });

    it('should go to addresses page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToAddressesPageToDeleteAddress', baseContext);

      await foDefaultMyAccountPage.goToAddressesPage(page);

      const pageHeaderTitle = await foDefaultMyAddressesPage.getPageTitle(page);
      expect(pageHeaderTitle).to.equal(foDefaultMyAddressesPage.pageTitle);
    });

    it('should try to delete the first address and check the error message', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'deleteAddress', baseContext);

      firstAddressPosition = await foDefaultMyAddressesPage.getAddressPosition(page, editAddressData.alias);
      secondAddressPosition = await foDefaultMyAddressesPage.getAddressPosition(page, secondAddressData.alias);

      const textResult = await foDefaultMyAddressesPage.deleteAddress(page, firstAddressPosition);
      expect(textResult).to.equal(foDefaultMyAddressesPage.deleteAddressErrorMessage);
    });

    it('should go to cart page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToShoppingCartPage', baseContext);

      await foDefaultMyAddressesPage.goToCartPage(page);

      const pageTitle = await foDefaultCartPage.getPageTitle(page);
      expect(pageTitle).to.equal(foDefaultCartPage.pageTitle);
    });

    it('should select the second address and continue', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'selectSecondAddress', baseContext);

      // Proceed to checkout the shopping cart
      await foDefaultCartPage.clickOnProceedToCheckout(page);

      await foDefaultCheckoutPage.chooseDeliveryAddress(page, secondAddressPosition);

      // Address step - Go to delivery step
      const isStepAddressComplete = await foDefaultCheckoutPage.goToDeliveryStep(page);
      expect(isStepAddressComplete, 'Step Address is not complete').to.eq(true);
    });

    it('should go to home page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToHomePageToDeleteAddress2', baseContext);

      await foDefaultHomePage.goToHomePage(page);

      const isHomePage = await foDefaultHomePage.isHomePage(page);
      expect(isHomePage, 'Home page is not displayed').to.eq(true);
    });

    it('should go to \'My Account\' page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToMyAccountPageToDeleteAddress2', baseContext);

      await foDefaultHomePage.goToMyAccountPage(page);

      const pageHeaderTitle = await foDefaultMyAccountPage.getPageTitle(page);
      expect(pageHeaderTitle).to.equal(foDefaultMyAccountPage.pageTitle);
    });

    it('should go to addresses page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToAddressesPageToDeleteAddress2', baseContext);

      await foDefaultMyAccountPage.goToAddressesPage(page);

      const pageHeaderTitle = await foDefaultMyAddressesPage.getPageTitle(page);
      expect(pageHeaderTitle).to.equal(foDefaultMyAddressesPage.pageTitle);
    });

    it('should delete the first address and check the success message', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'deleteAddress2', baseContext);

      const addressPosition = await foDefaultMyAddressesPage.getAddressPosition(page, editAddressData.alias);

      const textResult = await foDefaultMyAddressesPage.deleteAddress(page, addressPosition);
      expect(textResult).to.equal(foDefaultMyAddressesPage.deleteAddressSuccessfulMessage);
    });
  });

  // Post-condition: Delete created customer
  deleteCustomerTest(newCustomerData, `${baseContext}_postTest_1`);
});
