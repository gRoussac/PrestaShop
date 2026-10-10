// Import utils
import testContext from '@utils/testContext';

import {
  foDefaultCartPage,
  foDefaultCheckoutPage,
  foDefaultCheckoutOrderConfirmationPage,
  foDefaultHomePage,
  foDefaultProductPage,
} from '@utils/foDefaultPages';

import {
  boDashboardPage,
  boEmailPage,
  boLoginPage,
  type BrowserContext,
  dataCustomers,
  dataLanguages,
  dataPaymentMethods,
  type Page,
  utilsDate,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

import {expect} from 'chai';

const baseContext: string = 'functional_BO_advancedParameters_email_filterDeleteAndBulkActionsEmails';

/*
Create an order to have 2 email logs in email table
Filter email logs list
Delete email log
Delete email logs by bulk action
 */
describe('BO - Advanced Parameters - Email : Filter, delete and bulk delete emails', async () => {
  const today:string = utilsDate.getDateFormat('yyyy-mm-dd');

  let browserContext: BrowserContext;
  let page: Page;
  let numberOfEmails: number = 0;

  // before and after functions
  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  it('should login in BO', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'loginBO', baseContext);

    await boLoginPage.goTo(page, global.BO.URL);
    await boLoginPage.successLogin(page, global.BO.EMAIL, global.BO.PASSWD);

    const pageTitle = await boDashboardPage.getPageTitle(page);
    expect(pageTitle).to.contains(boDashboardPage.pageTitle);
  });

  describe('Create order to have emails in the table', async () => {
    it('should view my shop', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'viewMyShop', baseContext);

      // Click on view my shop
      page = await boDashboardPage.viewMyShop(page);

      // Change language in FO
      await foDefaultHomePage.changeLanguage(page, 'en');

      const isHomePage = await foDefaultHomePage.isHomePage(page);
      expect(isHomePage).to.eq(true);
    });

    it('should add the first product to the cart', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addProductToCart', baseContext);

      // Go to the first product page
      await foDefaultHomePage.goToProductPage(page, 1);

      // Add the product to the cart
      await foDefaultProductPage.addProductToTheCart(page);

      const pageTitle = await foDefaultCartPage.getPageTitle(page);
      expect(pageTitle).to.contains(foDefaultCartPage.pageTitle);
    });

    it('should proceed to checkout and sign in', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'proceedToCheckout', baseContext);

      // Proceed to checkout the shopping cart
      await foDefaultCartPage.clickOnProceedToCheckout(page);

      // Personal information step - Login
      await foDefaultCheckoutPage.clickOnSignIn(page);
      await foDefaultCheckoutPage.customerLogin(page, dataCustomers.johnDoe);
    });

    it('should go to delivery step', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToDeliveryStep', baseContext);

      // Address step - Go to delivery step
      const isStepAddressComplete = await foDefaultCheckoutPage.goToDeliveryStep(page);
      expect(isStepAddressComplete, 'Step Address is not complete').to.eq(true);
    });

    it('should go to payment step', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToPaymentStep', baseContext);

      // Delivery step - Go to payment step
      const isStepDeliveryComplete = await foDefaultCheckoutPage.goToPaymentStep(page);
      expect(isStepDeliveryComplete, 'Step Address is not complete').to.eq(true);
    });

    it('should pay the order', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'payTheOrder', baseContext);

      // Payment step - Choose payment step
      await foDefaultCheckoutPage.choosePaymentAndOrder(page, dataPaymentMethods.wirePayment.moduleName);

      // Check the confirmation message
      const cardTitle = await foDefaultCheckoutOrderConfirmationPage.getOrderConfirmationCardTitle(page);
      expect(cardTitle).to.contains(foDefaultCheckoutOrderConfirmationPage.orderConfirmationCardTitle);
    });

    it('should logout from FO', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'logoutFO', baseContext);

      // Logout from FO
      await foDefaultCheckoutOrderConfirmationPage.logout(page);

      const isCustomerConnected = await foDefaultCheckoutOrderConfirmationPage.isCustomerConnected(page);
      expect(isCustomerConnected, 'Customer is not connected').to.eq(false);
    });

    it('should go back to BO', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goBackToBO', baseContext);

      // Go Back to BO
      page = await foDefaultCheckoutOrderConfirmationPage.closePage(browserContext, page, 0);

      const pageTitle = await boDashboardPage.getPageTitle(page);
      expect(pageTitle).to.contains(boDashboardPage.pageTitle);
    });
  });

  describe('Filter E-mail table', async () => {
    it('should go to \'Advanced Parameters > E-mail\' page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToEmailPage', baseContext);

      await boDashboardPage.goToSubMenu(
        page,
        boDashboardPage.advancedParametersLink,
        boDashboardPage.emailLink,
      );

      const pageTitle = await boEmailPage.getPageTitle(page);
      expect(pageTitle).to.contains(boEmailPage.pageTitle);
    });

    it('should reset all filters and get number of email logs', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'resetFiltersFirst', baseContext);

      numberOfEmails = await boEmailPage.resetAndGetNumberOfLines(page);
      expect(numberOfEmails).to.be.above(0);
    });
    const tests = [
      {
        args:
          {
            identifier: 'filterById',
            filterType: 'input',
            filterBy: 'id_mail',
            filterValue: '1',
          },
      },
      {
        args:
          {
            identifier: 'filterByRecipient',
            filterType: 'input',
            filterBy: 'recipient',
            filterValue: dataCustomers.johnDoe.email,
          },
      },
      {
        args:
          {
            identifier: 'filterByTemplate',
            filterType: 'input',
            filterBy: 'template',
            filterValue: 'order_conf',
          },
      },
      {
        args:
          {
            identifier: 'filterByLanguage',
            filterType: 'select',
            filterBy: 'id_lang',
            filterValue: dataLanguages.english.name,
          },
      },
      {
        args:
          {
            identifier: 'filterBySubject',
            filterType: 'input',
            filterBy: 'subject',
            filterValue: dataPaymentMethods.wirePayment.name.toLowerCase(),
          },
      },
    ];

    tests.forEach((test) => {
      it(`should filter E-mail table by '${test.args.filterBy}'`, async function () {
        await testContext.addContextItem(this, 'testIdentifier', test.args.identifier, baseContext);

        await boEmailPage.filterEmailLogs(
          page,
          test.args.filterType,
          test.args.filterBy,
          test.args.filterValue,
        );

        const numberOfEmailsAfterFilter = await boEmailPage.getNumberOfElementInGrid(page);
        expect(numberOfEmailsAfterFilter).to.be.at.most(numberOfEmails);

        for (let row = 1; row <= numberOfEmailsAfterFilter; row++) {
          const textColumn = await boEmailPage.getTextColumn(page, test.args.filterBy, row);
          expect(textColumn).to.contains(test.args.filterValue);
        }
      });

      it('should reset all filters', async function () {
        await testContext.addContextItem(this, 'testIdentifier', `${test.args.identifier}Reset`, baseContext);

        const numberOfEmailsAfterReset = await boEmailPage.resetAndGetNumberOfLines(page);
        expect(numberOfEmailsAfterReset).to.be.equal(numberOfEmails);
      });
    });

    it('should filter E-mail table by date sent \'From\' and \'To\'', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'filterByDateSent', baseContext);

      await boEmailPage.filterEmailLogsByDate(page, today, today);

      const numberOfEmailsAfterFilter = await boEmailPage.getNumberOfElementInGrid(page);
      expect(numberOfEmailsAfterFilter).to.be.at.most(numberOfEmails);

      for (let row = 1; row <= numberOfEmailsAfterFilter; row++) {
        const textColumn = await boEmailPage.getTextColumn(page, 'date_add', row);
        expect(textColumn).to.contains(today);
      }
    });

    it('should reset all filters', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'dateSentReset', baseContext);

      const numberOfEmailsAfterReset = await boEmailPage.resetAndGetNumberOfLines(page);
      expect(numberOfEmailsAfterReset).to.be.equal(numberOfEmails);
    });
  });

  describe('Delete E-mail', async () => {
    it('should filter email list by \'subject\'', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'filterBySubjectToDelete', baseContext);

      await boEmailPage.filterEmailLogs(page, 'input', 'subject', dataPaymentMethods.wirePayment.name);

      const numberOfEmailsAfterFilter = await boEmailPage.getNumberOfElementInGrid(page);
      expect(numberOfEmailsAfterFilter).to.be.at.most(numberOfEmails);
    });

    it('should delete email', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'deleteEmail', baseContext);

      const textResult = await boEmailPage.deleteEmailLog(page, 1);
      expect(textResult).to.equal(boEmailPage.successfulMultiDeleteMessage);
    });

    it('should reset all filters', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'resetAfterDelete', baseContext);

      const numberOfEmailsAfterReset = await boEmailPage.resetAndGetNumberOfLines(page);
      expect(numberOfEmailsAfterReset).to.be.equal(numberOfEmails - 1);
    });
  });

  describe('Delete E-mail by bulk action', async () => {
    it('should delete all emails', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'BulkDelete', baseContext);

      const deleteTextResult = await boEmailPage.deleteEmailLogsBulkActions(page);
      expect(deleteTextResult).to.be.equal(boEmailPage.successfulMultiDeleteMessage);
    });
  });
});
