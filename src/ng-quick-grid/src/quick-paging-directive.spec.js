(function () {
  /* globals describe, it, beforeEach, inject, expect, angular */
  'use strict';

  describe('ngQuickGrid', function () {
    var model;
    beforeEach(module('ngQuickGrid'));
    beforeEach(inject(function (SearchModel) {
      model = {
        search: new SearchModel('Name desc'),
        results: null
      };
    }));

    describe('quickPagingDirective', function () {
      it('model is applied to controller', inject(function ($rootScope, $compile, $templateCache) {
        $templateCache.put('/quick-grid/quick-grid-footer.html', '<span>Hi</span>');

        var scope = $rootScope.$new();
        scope.model = model.search;
        var element = angular.element('<table quick-grid grid-model="model.search"><tfoot><tr><td colspan="6" class="text-center" quick-paging></td></tr></tfoot></table>');
        element = $compile(element)(scope);
        $rootScope.$digest();
        var td = element[0].querySelector('tfoot td');
        var footScope = angular.element(td).scope();

        expect(footScope.quickPaging).not.toBeUndefined();
        expect(footScope.quickPaging.searchModel).toEqual(scope.model.search);
      }));
    });
  });
})();