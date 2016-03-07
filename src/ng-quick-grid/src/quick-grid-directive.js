(function () {
  'use strict';

  angular.module('ngQuickGrid')
    .directive('quickGrid', function () {
      return {
        restrict: 'A',
        scope: true,
        controllerAs: 'grid',
        controller: function ($scope, $element, $attrs) {
          this.searchModel = $scope.$eval($attrs.gridModel);
        }
      };
    });

  /*
model.addFilter('Company.Name', '%');

    */
})();