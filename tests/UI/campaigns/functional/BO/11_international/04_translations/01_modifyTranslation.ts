import testContext from '@utils/testContext';
import {expect} from 'chai';

import {setupSmtpConfigTest, resetSmtpConfigTest} from '@commonTests/BO/advancedParameters/smtp';

import {
  foDefaultContactUsPage,
  foDefaultCreateAccountPage,
  foDefaultHomePage,
  foDefaultLoginPage,
} from '@utils/foDefaultPages';

import {
  boCartRulesPage,
  boCartRulesCreatePage,
  boDashboardPage,
  boLoginPage,
  boModuleManagerPage,
  boStoresPage,
  boTranslationsPage,
  type BrowserContext,
  dataLanguages,
  dataModules,
  FakerCustomer,
  type MailDev,
  type MailDevEmail,
  type Page,
  utilsMail,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_BO_international_translations_modifyTranslation';

describe('BO - International - Translation : Modify translation', async () => {
  let browserContext: BrowserContext;
  let page: Page;
  let newMail: MailDevEmail;
  let mailListener: MailDev;
  const customerData: FakerCustomer = new FakerCustomer();

  // Pre-Condition: Setup config SMTP
  setupSmtpConfigTest(`${baseContext}_preTest_1`);

  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);

    // Start listening to maildev server
    mailListener = utilsMail.createMailListener();
    utilsMail.startListener(mailListener);

    // Handle every new email
    mailListener.on('new', (email: MailDevEmail) => {
      newMail = email;
    });
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);

    // Stop listening to maildev server
    utilsMail.stopListener(mailListener);
  });

  it('should login in BO', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'loginBO', baseContext);

    await boLoginPage.goTo(page, global.BO.URL);
    await boLoginPage.successLogin(page, global.BO.EMAIL, global.BO.PASSWD);

    const pageTitle = await boDashboardPage.getPageTitle(page);
    expect(pageTitle).to.contains(boDashboardPage.pageTitle);
  });

  describe('Case 1 - Back office translations', async () => {
    it('should go to \'International > Translations\' page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToTranslationsPage', baseContext);

      await boDashboardPage.goToSubMenu(
        page,
        boDashboardPage.internationalParentLink,
        boDashboardPage.translationsLink,
      );

      const pageTitle = await boTranslationsPage.getPageTitle(page);
      expect(pageTitle).to.contains(boTranslationsPage.pageTitle);
    });

    it(`should choose the translation 'Back office' and the language ${dataLanguages.english.name}`, async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'modifyTranslation', baseContext);

      await boTranslationsPage.modifyTranslation(page, 'Back office translations', 'classic', dataLanguages.english.name);

      const pageTitle = await boTranslationsPage.getPageTitle(page);
      expect(pageTitle).to.contains(boTranslationsPage.pageTitle);
    });

    it('should search \'Generate\' expression and modify the translation to \'Generate code\'', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'translateExpression', baseContext);

      await boTranslationsPage.searchTranslation(page, 'Generate');

      const textResult = await boTranslationsPage.translateExpression(page, 'Generate code');
      expect(textResult).to.equal(boTranslationsPage.validationMessage);
    });

    it('should go to \'Catalog > Discounts\' page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToDiscountsPage2', baseContext);

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

    it('should check that the button name is equal to \'Generate code\'', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkButtonName', baseContext);

      const buttonName = await boCartRulesCreatePage.getGenerateButtonName(page);
      expect(buttonName).to.equal('Generate code');
    });
  });

  describe('Case 2 - Front office translations with default theme', async () => {
    it('should go back to BO', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goBackToBo', baseContext);

      // Close tab and init other page objects with new current tab
      page = await foDefaultHomePage.closePage(browserContext, page, 0);

      const pageTitle = await boTranslationsPage.getPageTitle(page);
      expect(pageTitle).to.contains(boTranslationsPage.pageTitle);
    });

    it('should go to \'International > Translations\' page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToTranslationsPage3', baseContext);

      await boDashboardPage.goToSubMenu(
        page,
        boDashboardPage.internationalParentLink,
        boDashboardPage.translationsLink,
      );

      const pageTitle = await boTranslationsPage.getPageTitle(page);
      expect(pageTitle).to.contains(boTranslationsPage.pageTitle);
    });

    it(`should choose the translation 'Front office with default theme' and the language '${dataLanguages.english.name}'`,
      async function () {
        await testContext.addContextItem(this, 'testIdentifier', 'modifyTranslation3', baseContext);

        await boTranslationsPage.modifyTranslation(page, 'Front office Translations', 'default', dataLanguages.english.name);

        const pageTitle = await boTranslationsPage.getPageTitle(page);
        expect(pageTitle).to.contains(boTranslationsPage.pageTitle);
      });

    it('should search \'Popular Products\' expression and modify the french translation', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'translateExpression3', baseContext);

      await boTranslationsPage.searchTranslation(page, 'Send your message');

      const textResult = await boTranslationsPage.translateExpression(page, 'Send your message now');
      expect(textResult).to.equal(boTranslationsPage.validationMessage);
    });

    it('should go to FO page and change the language to English', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToFO2', baseContext);

      page = await boTranslationsPage.viewMyShop(page);
      await foDefaultHomePage.changeLanguage(page, 'en');

      const isHomePage = await foDefaultHomePage.isHomePage(page);
      expect(isHomePage).to.eq(true);
    });

    it('should check \'Contact us\' header link', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkContactUsHeaderLink', baseContext);

      await foDefaultHomePage.clickOnHeaderLink(page, 'Contact us');

      const pageTitle = await foDefaultContactUsPage.getPageTitle(page);
      expect(pageTitle).to.contains(foDefaultContactUsPage.pageTitle);
    });

    it('should get the "Send" button label', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'getSendButtonLabel', baseContext);

      const sendButtonLabel = await foDefaultContactUsPage.getSendButtonLabel(page);
      expect(sendButtonLabel).to.equal('Send your message now');
    });
  });

  describe('Case 4 - Installed modules translations', async () => {
    it('should go back to BO', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goBackToBo2', baseContext);

      // Close tab and init other page objects with new current tab
      page = await foDefaultHomePage.closePage(browserContext, page, 0);

      const pageTitle = await boTranslationsPage.getPageTitle(page);
      expect(pageTitle).to.contains(boTranslationsPage.pageTitle);
    });

    it('should go to \'International > Translations\' page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToTranslationsPage4', baseContext);

      await boDashboardPage.goToSubMenu(
        page,
        boDashboardPage.internationalParentLink,
        boDashboardPage.translationsLink,
      );

      const pageTitle = await boTranslationsPage.getPageTitle(page);
      expect(pageTitle).to.contains(boTranslationsPage.pageTitle);
    });

    it(`should choose the translation 'Installed modules' and the language '${dataLanguages.english.name}'`, async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'modifyTranslation4', baseContext);

      await boTranslationsPage.modifyTranslation(
        page,
        'Installed modules translations',
        'default',
        dataLanguages.english.name,
        dataModules.contactForm.name,
      );

      const pageTitle = await boTranslationsPage.getPageTitle(page);
      expect(pageTitle).to.contains(boTranslationsPage.pageTitle);
    });

    it('should search \'Contact form\' expression and modify the english translation', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'translateExpression4', baseContext);

      await boTranslationsPage.searchTranslation(page, 'Contact form');

      const textResult = await boTranslationsPage.translateExpression(page, 'Contact form Module Edited');
      expect(textResult).to.equal(boTranslationsPage.validationMessage);
    });

    it('should go to \'Modules > Module Manager\' page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToModuleManagerPage', baseContext);

      await boDashboardPage.goToSubMenu(
        page,
        boDashboardPage.modulesParentLink,
        boDashboardPage.moduleManagerLink,
      );
      await boModuleManagerPage.closeSfToolBar(page);

      const pageTitle = await boModuleManagerPage.getPageTitle(page);
      expect(pageTitle).to.contains(boModuleManagerPage.pageTitle);
    });

    it(`should search the module ${dataModules.contactForm.name}`, async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'searchModule', baseContext);

      const isModuleVisible = await boModuleManagerPage.searchModule(page, dataModules.contactForm);
      expect(isModuleVisible, 'Module is not visible!').to.eq(true);
    });

    it('should check the module name', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkModuleName', baseContext);

      const moduleName = await boModuleManagerPage.getModuleName(page, dataModules.contactForm);
      expect(moduleName).to.eq('Contact form Module Edited');
    });
  });

  describe('Case 5 - Email translations', async () => {
    it('should go to \'International > Translations\' page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToTranslationsPage5', baseContext);

      await boDashboardPage.goToSubMenu(
        page,
        boDashboardPage.internationalParentLink,
        boDashboardPage.translationsLink,
      );

      const pageTitle = await boTranslationsPage.getPageTitle(page);
      expect(pageTitle).to.contains(boTranslationsPage.pageTitle);
    });

    it(`should choose the translation 'Email translations' and the language '${dataLanguages.english.name}'`, async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'modifyTranslation5', baseContext);

      await boTranslationsPage.modifyTranslation(
        page,
        'Email translations',
        'default',
        dataLanguages.english.name,
        '',
        'Subject',
      );

      const pageTitle = await boTranslationsPage.getPageTitle(page);
      expect(pageTitle).to.contains(boTranslationsPage.pageTitle);
    });

    it('should search \'Welcome!\' expression and modify the english translation', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'translateExpression5', baseContext);

      await boTranslationsPage.searchTranslation(page, 'Welcome!');

      const textResult = await boTranslationsPage.translateExpression(page, 'You"re welcome');
      expect(textResult).to.equal(boTranslationsPage.validationMessage);
    });

    it('should view my shop', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'openFO', baseContext);

      page = await boStoresPage.viewMyShop(page);
      await foDefaultHomePage.changeLanguage(page, 'en');

      const isHomePage = await foDefaultHomePage.isHomePage(page);
      expect(isHomePage).to.eq(true);

      const isCustomerConnected = await foDefaultHomePage.isCustomerConnected(page);
      expect(isCustomerConnected, 'Customer is connected!').to.eq(false);
    });

    it('should go to create account page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToCreateAccountPage', baseContext);

      await foDefaultHomePage.goToLoginPage(page);
      await foDefaultLoginPage.goToCreateAccountPage(page);

      const pageHeaderTitle = await foDefaultCreateAccountPage.getHeaderTitle(page);
      expect(pageHeaderTitle).to.equal(foDefaultCreateAccountPage.formTitle);
    });

    it('should create new account', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'createAccount', baseContext);

      await foDefaultCreateAccountPage.createAccount(page, customerData);

      const isCustomerConnected = await foDefaultHomePage.isCustomerConnected(page);
      expect(isCustomerConnected).to.eq(true);
    });

    it('should sign out from FO', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'signOutFO', baseContext);

      await foDefaultCreateAccountPage.goToHomePage(page);
      await foDefaultHomePage.logout(page);

      const isCustomerConnected = await foDefaultHomePage.isCustomerConnected(page);
      expect(isCustomerConnected, 'Customer is connected').to.eq(false);
    });

    it('should check if the mail is in mailbox and check the subject', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkMailIsInMailbox', baseContext);

      expect(newMail.subject).to.contains('You"re welcome');
    });
  });

  // Pre-Condition: Setup config SMTP
  resetSmtpConfigTest(`${baseContext}_postTest_2`);

  describe('Case 6 - Other translations', async () => {
    it('should go back to BO', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goBackToBo3', baseContext);

      // Close tab and init other page objects with new current tab
      page = await foDefaultHomePage.closePage(browserContext, page, 0);

      const pageTitle = await boTranslationsPage.getPageTitle(page);
      expect(pageTitle).to.contains(boTranslationsPage.pageTitle);
    });

    it('should go to \'International > Translations\' page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToTranslationsPage6', baseContext);

      await boDashboardPage.goToSubMenu(
        page,
        boDashboardPage.internationalParentLink,
        boDashboardPage.translationsLink,
      );

      const pageTitle = await boTranslationsPage.getPageTitle(page);
      expect(pageTitle).to.contains(boTranslationsPage.pageTitle);
    });

    it(`should choose the translation 'Other' and the language '${dataLanguages.english.name}'`, async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'modifyTranslation6', baseContext);

      await boTranslationsPage.modifyTranslation(page, 'Other translations', 'default', dataLanguages.english.name);

      const pageTitle = await boTranslationsPage.getPageTitle(page);
      expect(pageTitle).to.contains(boTranslationsPage.pageTitle);
    });

    it('should search an expression and modify the english translation', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'translateExpression6', baseContext);

      await boTranslationsPage.searchTranslation(page, 'If enabled, the voucher will not apply to products already on sale.');

      const textResult = await boTranslationsPage.translateExpression(page,
        'The voucher is available only for new products');
      expect(textResult).to.equal(boTranslationsPage.validationMessage);
    });

    it('should go to \'Catalog > Discounts\' page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToDiscountsPage', baseContext);

      await boDashboardPage.goToSubMenu(page, boDashboardPage.catalogParentLink, boDashboardPage.discountsLink);

      const pageTitle = await boCartRulesPage.getPageTitle(page);
      expect(pageTitle).to.contains(boCartRulesPage.pageTitle);
    });

    it('should go to new cart rule page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToNewCartRulePage2', baseContext);

      await boCartRulesPage.goToAddNewCartRulesPage(page);

      const pageTitle = await boCartRulesCreatePage.getPageTitle(page);
      expect(pageTitle).to.contains(boCartRulesCreatePage.pageTitle);
    });

    it('should go to ACTIONS tab and verify the translation of the title', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'verifyTranslation', baseContext);

      const title = await boCartRulesCreatePage.getTitleOfExcludeDiscountedProduct(page);
      expect(title).to.eq('The voucher is available only for new products');
    });
  });
});
