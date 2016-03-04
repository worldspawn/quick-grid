(function () {
  /* globals describe, it, beforeEach, inject, expect, angular */
  'use strict';

  describe('ngQuickGrid', function () {
    //angular.module('ngTestData').constant('apiBase', 'api');

    beforeEach(module('ngQuickGrid'));

    describe('quickGridDirective', function () {

      it('model is applied to controller', inject(function ($rootScope, $compile) {
        var scope = $rootScope.$new();
        scope.model = {};
        var element = angular.element('<table quick-grid grid-model="model"></table>');
        element = $compile(element)(scope);

        expect(element.scope()).not.toBeNull();
        expect(element.scope().grid).not.toBeNull();
        expect(element.scope().grid.searchModel).toEqual(scope.model);
      }));
    });
  });
})();