(function () {
  /* globals describe, it, beforeEach, inject, expect, angular */
  'use strict';

  describe('ngQuickGrid', function () {
    //angular.module('ngTestData').constant('apiBase', 'api');

    beforeEach(module('ngQuickGrid'));

    describe('quickPagingDirective', function () {
      it('model is applied to controller', inject(function ($rootScope, $compile, $templateCache) {
        $templateCache.put('/quick-grid/quick-grid-footer.html', '<span>Hi</span>');

        var scope = $rootScope.$new();
        scope.model = {};
        var element = angular.element('<table quick-grid grid-model="model"><tfoot><tr>          <td colspan="6" class="text-center" quick-paging></td></tr></tfoot></table>');
        element = $compile(element)(scope);
        $rootScope.$digest();
        var td = element[0].querySelector('tfoot td');
        var footScope = angular.element(td).scope();

        expect(footScope.quickPaging).not.toBeUndefined();
        expect(footScope.quickPaging.searchModel).toEqual(scope.model);
      }));
    });
  });
})();