// Import utils
import testContext from '@utils/testContext';

import {expect} from 'chai';
import {
  foDefaultCategoryPage,
  foDefaultHomePage,
} from '@utils/foDefaultPages';

import {
  type BrowserContext,
  dataCategories,
  type Page,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_FO_default_menuAndNavigation_navigateInCategories_breadcrumb';

describe('FO - Menu and Navigation - Navigate in Categories : Breadcrumb', async () => {
  let browserContext: BrowserContext;
  let page: Page;

  // before and after functions
  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  describe('Check breadcrumb', async () => {
    it('should open the shop page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToFO', baseContext);

      await foDefaultHomePage.goToFo(page);

      const isHomePage = await foDefaultHomePage.isHomePage(page);
      expect(isHomePage).to.equal(true);
    });

    it('should go to the category Clothes', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkClothesLink', baseContext);

      await foDefaultHomePage.goToCategory(page, dataCategories.clothes.id);

      const pageTitle = await foDefaultCategoryPage.getPageTitle(page);
      expect(pageTitle).to.equal(dataCategories.clothes.name);
    });

    it('should check breadcrumb', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkBreadcrumb1', baseContext);

      const breadcrumbText = await foDefaultCategoryPage.getBreadcrumbText(page);
      expect(breadcrumbText).to.equal('Home Clothes');
    });

    it(`should go to the subcategory "${dataCategories.men.name}"`, async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkMenLink', baseContext);

      await foDefaultHomePage.goToSubCategory(page, dataCategories.clothes.id, dataCategories.men.id);

      const pageTitle = await foDefaultHomePage.getPageTitle(page);
      expect(pageTitle).to.equal(dataCategories.men.name);
    });

    it('should check breadcrumb', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkBreadcrumb2', baseContext);

      const breadcrumbText = await foDefaultCategoryPage.getBreadcrumbText(page);
      expect(breadcrumbText).to.equal('Home Clothes Men');
    });

    it('should click on clothes link from the breadcrumb', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'clickOnClothesLink', baseContext);

      await foDefaultCategoryPage.clickOnBreadCrumbLink(page, 'clothes');

      const pageTitle = await foDefaultCategoryPage.getPageTitle(page);
      expect(pageTitle).to.equal(dataCategories.clothes.name);
    });

    it('should check breadcrumb', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkBreadcrumb3', baseContext);

      const breadcrumbText = await foDefaultCategoryPage.getBreadcrumbText(page);
      expect(breadcrumbText).to.equal('Home Clothes');
    });

    it('should click on Home link from the breadcrumb', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'clickOnHomeLink', baseContext);

      await foDefaultCategoryPage.clickOnBreadCrumbLink(page, '/');

      const isHomePage = await foDefaultHomePage.isHomePage(page);
      expect(isHomePage).to.equal(true);
    });

    it('should go to the subcategory stationery', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkStationeryLink', baseContext);

      await foDefaultHomePage.goToSubCategory(page, dataCategories.accessories.id, dataCategories.stationery.id);

      const pageTitle = await foDefaultCategoryPage.getPageTitle(page);
      expect(pageTitle).to.equal(dataCategories.stationery.name);
    });

    it('should check breadcrumb', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkBreadcrumb4', baseContext);

      const breadcrumbText = await foDefaultCategoryPage.getBreadcrumbText(page);
      expect(breadcrumbText).to.equal('Home Accessories Stationery');
    });

    it('should click on accessories link from the breadcrumb', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'clickOnAccessoriesLink', baseContext);

      await foDefaultCategoryPage.clickOnBreadCrumbLink(page, 'accessories');

      const pageTitle = await foDefaultCategoryPage.getPageTitle(page);
      expect(pageTitle).to.equal(dataCategories.accessories.name);
    });

    it('should check breadcrumb', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkBreadcrumb5', baseContext);

      const breadcrumbText = await foDefaultCategoryPage.getBreadcrumbText(page);
      expect(breadcrumbText).to.equal('Home Accessories');
    });

    it('should click on Home link from the breadcrumb', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'clickOnHomeLink2', baseContext);

      await foDefaultCategoryPage.clickOnBreadCrumbLink(page, '/');

      const isHomePage = await foDefaultHomePage.isHomePage(page);
      expect(isHomePage).to.equal(true);
    });
  });
});
