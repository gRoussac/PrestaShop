// Import utils
import testContext from '@utils/testContext';

import {expect} from 'chai';
import {
  foDefaultHomePage,
  foDefaultProductPage,
  foDefaultSearchResultsPage,
} from '@utils/foDefaultPages';

import {
  type BrowserContext,
  dataProducts,
  type Page,
  utilsCore,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_FO_default_search_searchProductAndValidate';

/*
Scenario:
- Go to FO
- Search product and see result
- Click on first product and check product page
- Click on enter and check search result page
*/

describe('FO - Search Page : Search product and validate', async () => {
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

  describe('Search product and validate', async () => {
    it('should go to FO', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToFO', baseContext);

      await foDefaultHomePage.goToFo(page);

      const isHomePage = await foDefaultHomePage.isHomePage(page);
      expect(isHomePage).to.eq(true);
    });

    it(`should search for the product ${dataProducts.demo_8.name} and check result`, async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'searchProduct1', baseContext);

      const searchValue: string = dataProducts.demo_8.name;
      const numSearchResults: number = 3;

      const numResults = await foDefaultHomePage.countAutocompleteSearchResult(page, searchValue);
      expect(numResults).equal(numSearchResults);

      const results = await foDefaultHomePage.getAutocompleteSearchResult(page, searchValue);

      const occurrence = await utilsCore.searchOccurrence(results, 'notebook');
      expect(occurrence).to.equal(numSearchResults);
    });

    it('should go to the first product in the list and check the product page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToFirstProductInList', baseContext);

      await foDefaultHomePage.clickAutocompleteSearchResult(page, 1);

      const pageTitle = await foDefaultProductPage.getPageTitle(page);
      expect(pageTitle).to.contains(dataProducts.demo_8.name);
    });

    it('should go to home page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToHomePage', baseContext);

      await foDefaultProductPage.goToHomePage(page);

      const isHomePage = await foDefaultHomePage.isHomePage(page);
      expect(isHomePage, 'Home page is not displayed').to.eq(true);
    });

    it('should search for the product and click on enter', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'searchProduct2', baseContext);

      await foDefaultHomePage.searchProduct(page, dataProducts.demo_8.name);

      const pageTitle = await foDefaultSearchResultsPage.getPageTitle(page);
      expect(pageTitle).to.equal(foDefaultSearchResultsPage.pageTitle);
    });

    it('should check that the searched value in the search input is visible', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkSearchedValue', baseContext);

      const inputContent = await foDefaultSearchResultsPage.getSearchInput(page);
      expect(inputContent).to.equal(dataProducts.demo_8.name);
    });

    it('should check the search result page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkSearchResultPage', baseContext);

      const countResults = await foDefaultSearchResultsPage.getSearchResultsNumber(page);
      expect(countResults).to.equal(3);
    });
  });
});
