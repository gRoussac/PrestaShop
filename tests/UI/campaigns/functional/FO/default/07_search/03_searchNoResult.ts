// Import utils
import testContext from '@utils/testContext';

import {expect} from 'chai';
import {
  foDefaultHomePage,
  foDefaultSearchResultsPage,
} from '@utils/foDefaultPages';

import {
  type BrowserContext,
  type Page,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_FO_default_search_searchNoResult';

/*
Scenario:
- Go to FO
- Search a string with less than 3 characters
- Search an empty string
*/

describe('FO - Search Page : Search no result', async () => {
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

  describe('Search no result', async () => {
    it('should go to FO home page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToFO', baseContext);

      await foDefaultHomePage.goToFo(page);

      const isHomePage = await foDefaultHomePage.isHomePage(page);
      expect(isHomePage).to.eq(true);
    });

    it('should search a string with less than 3 characters', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'searchSmallString', baseContext);

      const hasSearchResult = await foDefaultHomePage.hasAutocompleteSearchResult(page, 'te');
      expect(hasSearchResult, 'There are results in autocomplete search').to.eq(false);

      await foDefaultHomePage.searchProduct(page, 'te');

      const pageTitle = await foDefaultSearchResultsPage.getPageTitle(page);
      expect(pageTitle).to.equal(foDefaultSearchResultsPage.pageTitle);

      const hasResults = await foDefaultSearchResultsPage.hasResults(page);
      expect(hasResults, 'There are results!').to.equal(false);

      const searchInputValue = await foDefaultSearchResultsPage.getSearchValue(page);
      expect(searchInputValue, 'A search value exists').to.equal('te');
    });

    it('should search an empty string', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'searchEmptyString', baseContext);

      await foDefaultHomePage.searchProduct(page, '');

      const pageTitle = await foDefaultSearchResultsPage.getPageTitle(page);
      expect(pageTitle).to.equal(foDefaultSearchResultsPage.pageTitle);

      const hasResults = await foDefaultSearchResultsPage.hasResults(page);
      expect(hasResults, 'There are results!').to.equal(false);

      const searchInputValue = await foDefaultSearchResultsPage.getSearchValue(page);
      expect(searchInputValue, 'A search value exists').to.equal('');
    });
  });
});
