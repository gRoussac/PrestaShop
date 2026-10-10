// Import utils
import testContext from '@utils/testContext';

import {expect} from 'chai';
import {
  foDefaultContactUsPage,
  foDefaultHomePage,
} from '@utils/foDefaultPages';

import {
  type BrowserContext,
  dataEmployees,
  type Page,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_FO_default_contactUs_checkMailtoLink';

/*
Scenario:
- Go to FO
- Click on contact us link
- Check email us link
 */
describe('FO - Contact us : Check mail link on contact us page', async () => {
  let browserContext: BrowserContext;
  let page: Page;

  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  describe('Check mail link on contact us page', async () => {
    it('should go to FO home page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToFO', baseContext);

      await foDefaultHomePage.goToFo(page);

      const isHomePage = await foDefaultHomePage.isHomePage(page);
      expect(isHomePage).to.eq(true);
    });

    it('should go to \'Contact us\' page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToContactUsPage', baseContext);

      await foDefaultHomePage.clickOnHeaderLink(page, 'Contact us');

      const pageTitle = await foDefaultContactUsPage.getPageTitle(page);
      expect(pageTitle).to.contains(foDefaultContactUsPage.pageTitle);
    });

    it('should check email us link', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkEmailUsLink', baseContext);

      const emailUsLinkHref = await foDefaultContactUsPage.getEmailUsLink(page);
      expect(emailUsLinkHref).to.equal(`mailto:${dataEmployees.defaultEmployee.email}`);
    });
  });
});
