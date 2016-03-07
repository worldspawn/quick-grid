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

    describe('quickGridDirective', function () {
      it('model is applied to controller', inject(function ($rootScope, $compile) {
        var scope = $rootScope.$new();
        scope.model = model;

        var element = angular.element('<table quick-grid grid-model="model.search"></table>');
        element = $compile(element)(scope);

        expect(element.scope()).not.toBeNull();
        expect(element.scope().grid).not.toBeNull();
        expect(element.scope().grid.searchModel).toEqual(scope.model.search);
      }));
    });
  });
})();