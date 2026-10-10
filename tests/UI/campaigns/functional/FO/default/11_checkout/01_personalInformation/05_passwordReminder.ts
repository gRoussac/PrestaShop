// Import utils
import testContext from '@utils/testContext';

// Import common tests
import {deleteCustomerTest} from '@commonTests/BO/customers/customer';
import {resetSmtpConfigTest, setupSmtpConfigTest} from '@commonTests/BO/advancedParameters/smtp';
import {createAccountTest} from '@commonTests/FO/default/account';

import {
  foDefaultCartPage,
  foDefaultCheckoutPage,
  foDefaultHomePage,
  foDefaultMyAccountPage,
  foDefaultPasswordReminderPage,
  foDefaultProductPage,
} from '@utils/foDefaultPages';

import {
  type BrowserContext,
  FakerCustomer,
  type MailDev,
  type MailDevEmail,
  type Page,
  utilsMail,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

import {expect} from 'chai';

const baseContext: string = 'functional_FO_default_checkout_personalInformation_passwordReminder';

/*
Pre-condition:
- Setup SMTP config
- Create account on FO
Scenario:
- Open FO page
- Add first product to the cart
- Proceed to checkout and validate the cart
- Send an email to reset password
- Reset password
- Try to sign in with old password and check error message
- Try to sign in with new password
Post-condition:
- Delete created customer account
- Go back to default smtp config
 */
describe('FO - Checkout - Personal information : Password reminder', async () => {
  let browserContext: BrowserContext;
  let page: Page;
  let newMail: MailDevEmail;
  let mailListener: MailDev;

  const resetPasswordMailSubject: string = 'Password query confirmation';
  const customerData: FakerCustomer = new FakerCustomer();
  const newPassword: string = 'new test password';
  const customerNewPassword: FakerCustomer = new FakerCustomer();
  customerNewPassword.email = customerData.email;
  customerNewPassword.password = newPassword;

  // Pre-Condition : Setup config SMTP
  setupSmtpConfigTest(`${baseContext}_preTest_1`);

  // Pre-condition : Create new customer on FO
  createAccountTest(customerData, `${baseContext}_preTest_2`);

  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);

    mailListener = utilsMail.createMailListener();
    utilsMail.startListener(mailListener);
    // Handle every new email
    mailListener.on('new', (email: MailDevEmail) => {
      newMail = email;
    });
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
    utilsMail.stopListener(mailListener);
  });

  describe('Update customer password', async () => {
    it('should open FO page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'openFO', baseContext);

      await foDefaultHomePage.goToFo(page);
      await foDefaultHomePage.changeLanguage(page, 'en');

      const isHomePage = await foDefaultHomePage.isHomePage(page);
      expect(isHomePage).to.eq(true);
    });

    it('should add product to cart', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addProductToCart', baseContext);

      await foDefaultHomePage.goToProductPage(page, 1);
      await foDefaultProductPage.addProductToTheCart(page, 1);

      const pageTitle = await foDefaultCartPage.getPageTitle(page);
      expect(pageTitle).to.equal(foDefaultCartPage.pageTitle);
    });

    it('should proceed to checkout and validate the cart', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'validateCart', baseContext);

      await foDefaultCartPage.clickOnProceedToCheckout(page);

      const isCheckoutPage = await foDefaultCheckoutPage.isCheckoutPage(page);
      expect(isCheckoutPage).to.eq(true);
    });

    it('should click on sign in then on \'Forgot your password?\' link ', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'clickOnForgetPasswordLink', baseContext);

      await foDefaultCheckoutPage.clickOnSignIn(page);
      await foDefaultCheckoutPage.goToPasswordReminderPage(page);

      const pageTitle = await foDefaultPasswordReminderPage.getPageTitle(page);
      expect(pageTitle).to.equal(foDefaultPasswordReminderPage.pageTitle);
    });

    it('should set the email address and send reset link', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'sendResetPasswordLink', baseContext);

      await foDefaultPasswordReminderPage.sendResetPasswordLink(page, customerData.email);

      const successAlertContent = await foDefaultPasswordReminderPage.checkResetLinkSuccess(page);
      expect(successAlertContent).to.contains(customerData.email);
    });

    it('should check if reset password mail is in mailbox', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkResetPasswordMail', baseContext);

      expect(newMail.subject).to.contains(resetPasswordMailSubject);
    });

    it('should open reset password link', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'openResetPasswordLink', baseContext);

      await foDefaultPasswordReminderPage.openForgotPasswordPage(page, newMail.text);

      const pageTitle = await foDefaultPasswordReminderPage.getPageTitle(page);
      expect(pageTitle).to.equal(foDefaultPasswordReminderPage.pageTitle);
    });

    it('should check the email address to reset password', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkEmailAddress', baseContext);

      const emailAddress = await foDefaultPasswordReminderPage.getEmailAddressToReset(page);
      expect(emailAddress).to.contains(customerData.email);
    });

    it('should change the password and check the validation message', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'changePassword', baseContext);

      await foDefaultPasswordReminderPage.setNewPassword(page, newPassword);

      const successMessage = await foDefaultMyAccountPage.getSuccessMessageAlert(page);
      expect(successMessage).to.equal(`${foDefaultMyAccountPage.resetPasswordSuccessMessage} ${customerData.email}`);
    });

    it('should logout from FO', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'signOutFO', baseContext);

      await foDefaultMyAccountPage.logout(page);
      const isCustomerConnected = await foDefaultMyAccountPage.isCustomerConnected(page);
      expect(isCustomerConnected, 'Customer is connected').to.eq(false);
    });
  });

  describe('Check new customer password', async () => {
    it('should go to home page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToHomePage', baseContext);

      await foDefaultMyAccountPage.goToHomePage(page);
      const result = await foDefaultHomePage.isHomePage(page);
      expect(result).to.eq(true);
    });

    it('should add product to cart', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addProductToCart2', baseContext);

      await foDefaultHomePage.goToProductPage(page, 1);
      await foDefaultProductPage.addProductToTheCart(page, 1);

      const pageTitle = await foDefaultCartPage.getPageTitle(page);
      expect(pageTitle).to.equal(foDefaultCartPage.pageTitle);
    });

    it('should proceed to checkout and validate the cart', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'validateCart2', baseContext);

      await foDefaultCartPage.clickOnProceedToCheckout(page);

      const isCheckoutPage = await foDefaultCheckoutPage.isCheckoutPage(page);
      expect(isCheckoutPage).to.eq(true);
    });

    it('should enter an invalid credentials', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'enterInvalidCredentials', baseContext);

      await foDefaultCheckoutPage.clickOnSignIn(page);

      const isCustomerConnected = await foDefaultCheckoutPage.customerLogin(page, customerData);
      expect(isCustomerConnected, 'Customer is connected').to.eq(false);

      const loginError = await foDefaultCheckoutPage.getLoginError(page);
      expect(loginError).to.contains(foDefaultCheckoutPage.authenticationErrorMessage);
    });

    it('should sign in with customer credentials', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'signIn', baseContext);

      const isCustomerConnected = await foDefaultCheckoutPage.customerLogin(page, customerNewPassword);
      expect(isCustomerConnected, 'Customer is not connected').to.eq(true);
    });
  });

  // Post-condition : Delete created customer
  deleteCustomerTest(customerData, `${baseContext}_postTest_1`);

  // Post-condition : Reset SMTP config
  resetSmtpConfigTest(`${baseContext}_postTest_2`);
});
