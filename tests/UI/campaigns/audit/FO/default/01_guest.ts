import {expect} from 'chai';
import testContext from '@utils/testContext';

import {
  foDefaultAboutUsPage,
  foDefaultBestSalesPage,
  foDefaultCategoryPage,
  foDefaultContactUsPage,
  foDefaultCreateAccountPage,
  foDefaultDeliveryPage,
  foDefaultGuestOrderTrackingPage,
  foDefaultHomePage,
  foDefaultLegalNoticePage,
  foDefaultLoginPage,
  foDefaultNewProductsPage,
  foDefaultPricesDropPage,
  foDefaultProductPage,
  foDefaultSearchResultsPage,
  foDefaultSecurePaymentPage,
  foDefaultSitemapPage,
  foDefaultStoresPage,
  foDefaultTermsAndConditionsOfUsePage,
} from '@utils/foDefaultPages';

import {
  type BrowserContext,
  dataCategories,
  dataProducts,
  type Page,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'audit_FO_default_guest';

describe('Check FO public pages', async () => {
  let browserContext: BrowserContext;
  let page: Page;

  before(async function () {
    utilsPlaywright.setErrorsCaptured(true);

    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  beforeEach(async () => {
    utilsPlaywright.resetJsErrors();
  });

  it('should go to the home page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToHome', baseContext);

    await foDefaultHomePage.goTo(page, global.FO.URL);

    const result = await foDefaultHomePage.isHomePage(page);
    expect(result).to.eq(true);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to a category page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToCategory', baseContext);

    await foDefaultHomePage.goToCategory(page, dataCategories.clothes.id);

    const pageTitle = await foDefaultCategoryPage.getPageTitle(page);
    expect(pageTitle).to.equal(dataCategories.clothes.name);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to a subcategory page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToSubCategory', baseContext);

    await foDefaultCategoryPage.goToSubCategory(page, dataCategories.clothes.id, dataCategories.men.id);

    const pageTitle = await foDefaultCategoryPage.getPageTitle(page);
    expect(pageTitle).to.equal(dataCategories.men.name);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to a product page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToProduct', baseContext);

    await foDefaultCategoryPage.goToProductPage(page, 1);

    const pageTitle = await foDefaultProductPage.getPageTitle(page);
    expect(pageTitle.toUpperCase()).to.contains(dataProducts.demo_1.name.toUpperCase());

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should search a product', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToSearch', baseContext);

    await foDefaultProductPage.searchProduct(page, 'shirt');

    const pageTitle = await foDefaultSearchResultsPage.getPageTitle(page);
    expect(pageTitle).to.equal(foDefaultSearchResultsPage.pageTitle);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  describe('Check \'Products\' footer links', async () => {
    [
      {linkSelector: 'Prices drop', pageTitle: foDefaultPricesDropPage.pageTitle},
      {linkSelector: 'New products', pageTitle: foDefaultNewProductsPage.pageTitle},
      {linkSelector: 'Best sellers', pageTitle: foDefaultBestSalesPage.pageTitle},
    ].forEach((args, index: number) => {
      it(`should check '${args.linkSelector}' footer links`, async function () {
        await testContext.addContextItem(this, 'testIdentifier', `checkProductsFooterLinks${index}`, baseContext);

        await foDefaultHomePage.goToFooterLink(page, args.linkSelector);

        const pageTitle = await foDefaultHomePage.getPageTitle(page);
        expect(pageTitle).to.equal(args.pageTitle);

        const jsErrors = utilsPlaywright.getJsErrors();
        expect(jsErrors.length).to.equals(0);
      });
    });
  });

  describe('Check \'Our Company\' footer links', async () => {
    [
      {linkSelector: 'Delivery', pageTitle: foDefaultDeliveryPage.pageTitle},
      {linkSelector: 'Legal Notice', pageTitle: foDefaultLegalNoticePage.pageTitle},
      {linkSelector: 'Terms and conditions of use', pageTitle: foDefaultTermsAndConditionsOfUsePage.pageTitle},
      {linkSelector: 'About us', pageTitle: foDefaultAboutUsPage.pageTitle},
      {linkSelector: 'Secure payment', pageTitle: foDefaultSecurePaymentPage.pageTitle},
      {linkSelector: 'Contact us', pageTitle: foDefaultContactUsPage.pageTitle},
      {linkSelector: 'Sitemap', pageTitle: foDefaultSitemapPage.pageTitle},
      {linkSelector: 'Stores', pageTitle: foDefaultStoresPage.pageTitle},
    ].forEach((args, index: number) => {
      it(`should check '${args.linkSelector}' footer links`, async function () {
        await testContext.addContextItem(this, 'testIdentifier', `checkOurCompanyFooterLinks${index}`, baseContext);

        await foDefaultHomePage.goToFooterLink(page, args.linkSelector);

        const pageTitle = await foDefaultHomePage.getPageTitle(page);
        expect(pageTitle).to.equal(args.pageTitle);

        const jsErrors = utilsPlaywright.getJsErrors();
        expect(jsErrors.length).to.equals(0);
      });
    });
  });

  describe('Check \'Your Account\' footer links', async () => {
    [
      {linkSelector: 'Order tracking', pageTitle: foDefaultGuestOrderTrackingPage.pageTitle},
      {linkSelector: 'Sign in', pageTitle: foDefaultLoginPage.pageTitle},
      {linkSelector: 'Create account', pageTitle: foDefaultCreateAccountPage.formTitle},
    ].forEach((args, index: number) => {
      it(`should check '${args.linkSelector}' footer links`, async function () {
        await testContext.addContextItem(this, 'testIdentifier', `checkYourAccountFooterLinks${index}`, baseContext);

        await foDefaultHomePage.goToFooterLink(page, args.linkSelector);

        let pageTitle: string = '';

        if (args.linkSelector === 'Create account') {
          pageTitle = await foDefaultCreateAccountPage.getHeaderTitle(page);
        } else {
          pageTitle = await foDefaultHomePage.getPageTitle(page);
        }
        expect(pageTitle).to.equal(args.pageTitle);
      });
    });
  });
});
