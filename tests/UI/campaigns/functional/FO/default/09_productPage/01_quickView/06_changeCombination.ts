// Import utils
import testContext from '@utils/testContext';

import {expect} from 'chai';
import {
  foDefaultHomePage,
  foDefaultModalQuickViewPage,
} from '@utils/foDefaultPages';

import {
  type BrowserContext,
  type Page,
  type ProductAttribute,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_FO_default_productPage_quickView_changeCombination';

/*
Scenario:
- Go to FO
- Quick view first product
- Change combination then close the modal
- Quick view third product
- Change combination
 */
describe('FO - Product page - Quick view : Change combination', async () => {
  let browserContext: BrowserContext;
  let page: Page;
  const firstAttributes: ProductAttribute[] = [
    {
      name: 'size',
      value: 'XL',
    }, {
      name: 'color',
      value: 'White',
    },
  ];
  const secondAttributes: ProductAttribute[] = [
    {
      name: 'size',
      value: 'XL',
    }, {
      name: 'color',
      value: 'Black',
    },
  ];
  const thirdAttributes: ProductAttribute = {
    name: 'dimension',
    value: '40x60cm',
  };

  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  describe('Change combination', async () => {
    it('should go to FO home page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToFo', baseContext);

      await foDefaultHomePage.goToFo(page);

      const isHomePage = await foDefaultHomePage.isHomePage(page);
      expect(isHomePage).to.equal(true);
    });

    it('should quick view the first product', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'quickViewFirstProduct', baseContext);

      await foDefaultHomePage.quickViewProduct(page, 1);

      const isModalVisible = await foDefaultModalQuickViewPage.isQuickViewProductModalVisible(page);
      expect(isModalVisible).to.equal(true);
    });

    it('should check all displayed attributes', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkALlDisplayedAttributes', baseContext);

      const productAttributesFromQuickView = await foDefaultModalQuickViewPage.getProductAttributesFromQuickViewModal(page);
      await Promise.all([
        expect(productAttributesFromQuickView.length).to.equal(2),
        expect(productAttributesFromQuickView[0].name).to.equal('size'),
        expect(productAttributesFromQuickView[0].value).to.equal('S M L XL'),
        expect(productAttributesFromQuickView[1].name).to.equal('color'),
        expect(productAttributesFromQuickView[1].value).to.equal('Color - White Color - Black'),
      ]);
    });

    it('should select the size XL', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'selectSize', baseContext);

      await foDefaultModalQuickViewPage.setAttribute(page, firstAttributes[0]);

      const resultAttributes = await foDefaultModalQuickViewPage.getSelectedAttributes(page);
      expect(resultAttributes[0].name).to.be.equal(firstAttributes[0].name);
      expect(resultAttributes[0].value).to.be.equal(firstAttributes[0].value);
    });

    it('should select the color black and check the cover image', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'selectBlackColor', baseContext);

      await foDefaultModalQuickViewPage.setAttribute(page, secondAttributes[1]);

      const quickViewImageMain = await foDefaultModalQuickViewPage.getQuickViewImageMain(page);
      expect(quickViewImageMain).to.contains('1-default_xl');
    });

    it('should select the color white and check the cover image', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'selectWhiteColor', baseContext);

      await foDefaultModalQuickViewPage.setAttribute(page, firstAttributes[1]);

      const quickViewImageMain = await foDefaultModalQuickViewPage.getQuickViewImageMain(page);
      expect(quickViewImageMain).to.contains('2-default_xl');
    });

    it('should close the quick view modal', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'closeQuickViewModal', baseContext);

      const isQuickViewModalClosed = await foDefaultModalQuickViewPage.closeQuickViewModal(page);
      expect(isQuickViewModalClosed).to.equal(true);
    });

    it('should quick view the third product', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'quickView2', baseContext);

      await foDefaultHomePage.quickViewProduct(page, 3);

      const isModalVisible = await foDefaultModalQuickViewPage.isQuickViewProductModalVisible(page);
      expect(isModalVisible).to.equal(true);
    });

    it('should check all displayed dimension', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkALlDisplayedDimension', baseContext);

      const productAttributesFromQuickView = await foDefaultModalQuickViewPage.getProductAttributesFromQuickViewModal(page);
      await Promise.all([
        expect(productAttributesFromQuickView.length).to.equal(1),
        expect(productAttributesFromQuickView[0].name).to.equal('dimension'),
        expect(productAttributesFromQuickView[0].value).to.equal('40x60cm 60x90cm 80x120cm'),
      ]);
    });

    it('should check selected dimension', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkSelectedDimension', baseContext);

      const productAttributesFromQuickView = await foDefaultModalQuickViewPage.getSelectedAttributesFromQuickViewModal(
        page,
        thirdAttributes,
      );
      await Promise.all([
        expect(productAttributesFromQuickView.length).to.equal(1),
        expect(productAttributesFromQuickView[0].name).to.equal('dimension'),
        expect(productAttributesFromQuickView[0].value).to.equal('40x60cm'),
      ]);
    });
  });
});
