// Import utils
import testContext from '@utils/testContext';

// Import commonTests
import {setupSmtpConfigTest, resetSmtpConfigTest} from '@commonTests/BO/advancedParameters/smtp';

import {expect} from 'chai';
import fs from 'fs';
import path from 'path';
import {
  boDashboardPage,
  boImportPage,
  boLoginPage,
  type BrowserContext,
  type MailDev,
  type MailDevEmail,
  type Page,
  utilsFile,
  utilsMail,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_BO_advancedParameters_import_importFile';
const importFixturesDir: string = path.resolve(__dirname, '../../../../../../Resources/import');

describe('BO - Advanced Parameters - Import : Import file', async () => {
  let browserContext: BrowserContext;
  let page: Page;
  let newMail: MailDevEmail;
  let mailListener: MailDev;
  const firstFile:string = 'alias.csv';
  const secondFile:string = 'suppliers.csv';

  // Pre-Condition : Setup config SMTP
  setupSmtpConfigTest(baseContext);

  // before and after functions
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
    // Delete downloaded csv files
    await utilsFile.deleteFile(firstFile);
    await utilsFile.deleteFile(secondFile);

    // Stop listening to maildev server
    utilsMail.stopListener(mailListener);
  });

  describe('Import : Import file', async () => {
    it('should login in BO', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'loginBO', baseContext);

      await boLoginPage.goTo(page, global.BO.URL);
      await boLoginPage.successLogin(page, global.BO.EMAIL, global.BO.PASSWD);

      const pageTitle = await boDashboardPage.getPageTitle(page);
      expect(pageTitle).to.contains(boDashboardPage.pageTitle);
    });

    it('should go to \'Advanced Parameters > Import\' page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToImportPage', baseContext);

      await boDashboardPage.goToSubMenu(
        page,
        boDashboardPage.advancedParametersLink,
        boDashboardPage.importLink,
      );
      await boImportPage.closeSfToolBar(page);

      const pageTitle = await boImportPage.getPageTitle(page);
      expect(pageTitle).to.contains(boImportPage.pageTitle);
    });

    describe('Import alias simple file', async () => {
      it('should prepare alias fixture file', async function () {
        await testContext.addContextItem(this, 'testIdentifier', 'prepareAliasFixture', baseContext);

        fs.copyFileSync(path.join(importFixturesDir, 'alias_import.csv'), firstFile);

        const doesFileExist = await utilsFile.doesFileExist(firstFile);
        expect(doesFileExist, 'alias fixture file was not prepared').to.be.eq(true);
      });

      it('should upload the file', async function () {
        await testContext.addContextItem(this, 'testIdentifier', 'importFile', baseContext);

        const uploadSuccessText = await boImportPage.uploadImportFile(page, 'Alias', firstFile);
        expect(uploadSuccessText).to.contains(firstFile);
      });

      it('should go to next import file step', async function () {
        await testContext.addContextItem(this, 'testIdentifier', 'nextStep', baseContext);

        const panelTitle = await boImportPage.goToImportNextStep(page);
        expect(panelTitle).to.contains(boImportPage.importPanelTitle);
      });

      it('should start import file', async function () {
        await testContext.addContextItem(this, 'testIdentifier', 'confirmImport', baseContext);

        const modalTitle = await boImportPage.startFileImport(page);
        expect(modalTitle).to.contains(boImportPage.importModalTitle);
      });

      it('should check that the import is completed', async function () {
        await testContext.addContextItem(this, 'testIdentifier', 'waitForImport', baseContext);

        const isCompleted = await boImportPage.getImportValidationMessage(page);
        expect(isCompleted, 'The import is not completed!')
          .to.contains('Data imported')
          .and.to.contains('Look at your listings to make sure it\'s all there as you wished.');
      });

      it('should close import progress modal', async function () {
        await testContext.addContextItem(this, 'testIdentifier', 'closeImportModal', baseContext);

        const isModalClosed = await boImportPage.closeImportModal(page);
        expect(isModalClosed).to.be.eq(true);
      });

      it('should check if reset password mail is in mailbox', async function () {
        await testContext.addContextItem(this, 'testIdentifier', 'checkIfImportMailFileIsInMailbox', baseContext);

        expect(newMail.subject).to.contains(`[${global.INSTALL.SHOP_NAME}] Import complete`);
      });
    });

    describe('Check choose from history / FTP then import suppliers simple file', async () => {
      it('should prepare suppliers fixture file', async function () {
        await testContext.addContextItem(this, 'testIdentifier', 'prepareSuppliersFixture', baseContext);

        fs.copyFileSync(path.join(importFixturesDir, 'suppliers_import.csv'), secondFile);

        const doesFileExist = await utilsFile.doesFileExist(secondFile);
        expect(doesFileExist, 'suppliers fixture file was not prepared').to.be.eq(true);
      });

      it('should upload the file', async function () {
        await testContext.addContextItem(this, 'testIdentifier', 'importFile2', baseContext);

        const uploadSuccessText = await boImportPage.uploadImportFile(page, 'Suppliers', secondFile);
        expect(uploadSuccessText).contain('suppliers.csv');
      });

      it('should click on the downloaded file and check the existence of the button choose from history', async function () {
        await testContext.addContextItem(this, 'testIdentifier', 'clickOnDownloadedFile', baseContext);

        await boImportPage.clickOnDownloadedFile(page);

        const isButtonVisible = await boImportPage.isChooseFromHistoryButtonVisible(page);
        expect(isButtonVisible).to.be.eq(true);
      });

      it('should click on \'Choose from history / FTP\'', async function () {
        await testContext.addContextItem(this, 'testIdentifier', 'clickOnChooseFromHistory', baseContext);

        const isFilesListTableVisible = await boImportPage.chooseFromHistoryFTP(page);
        expect(isFilesListTableVisible).to.be.eq(true);
      });

      it('should check the imported files list', async function () {
        await testContext.addContextItem(this, 'testIdentifier', 'checkImportedFilesList', baseContext);

        const importedFilesList = await boImportPage.getImportedFilesList(page);
        expect(importedFilesList).to.contains(firstFile)
          .and.to.contains(secondFile);
      });

      it('should delete the first imported file', async function () {
        await testContext.addContextItem(this, 'testIdentifier', 'deleteFirstFile', baseContext);

        // Delete file and check that choose from history button is visible
        const isButtonVisible = await boImportPage.deleteFile(page);
        expect(isButtonVisible).to.be.eq(true);
      });

      it('should use the second imported file', async function () {
        await testContext.addContextItem(this, 'testIdentifier', 'useSecondFile', baseContext);

        await boImportPage.chooseFromHistoryFTP(page);

        const uploadSuccessText = await boImportPage.useFile(page, 1);
        expect(uploadSuccessText).to.contains(secondFile);
      });

      it('should go to next import file step', async function () {
        await testContext.addContextItem(this, 'testIdentifier', 'nextStep2', baseContext);

        await boImportPage.selectFileType(page, 'Suppliers');

        const panelTitle = await boImportPage.goToImportNextStep(page);
        expect(panelTitle).to.contains(boImportPage.importPanelTitle);
      });

      it('should start import file', async function () {
        await testContext.addContextItem(this, 'testIdentifier', 'confirmImport2', baseContext);

        const modalTitle = await boImportPage.startFileImport(page);
        expect(modalTitle).to.contains(boImportPage.importModalTitle);
      });

      it('should check that the import is completed', async function () {
        await testContext.addContextItem(this, 'testIdentifier', 'waitForImport2', baseContext);

        const isCompleted = await boImportPage.getImportValidationMessage(page);
        expect(isCompleted, 'The import is not completed!')
          .to.contains('Data imported')
          .and.to.contains('Look at your listings to make sure it\'s all there as you wished.');
      });

      it('should close import progress modal', async function () {
        await testContext.addContextItem(this, 'testIdentifier', 'closeImportModal2', baseContext);

        const isModalClosed = await boImportPage.closeImportModal(page);
        expect(isModalClosed).to.be.eq(true);
      });

      it('should check if reset password mail is in mailbox', async function () {
        await testContext.addContextItem(this, 'testIdentifier', 'checkIfImportFTPFileIsInMailbox', baseContext);

        expect(newMail.subject).to.contains(`[${global.INSTALL.SHOP_NAME}] Import complete`);
      });
    });
  });

  // Post-Condition : Reset SMTP config
  resetSmtpConfigTest(baseContext);
});
