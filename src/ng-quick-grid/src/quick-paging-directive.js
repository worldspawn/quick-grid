(function () {
  'use strict';

  angular.module('ngQuickGrid')
    .directive('quickPaging', function () {
      return {
        restrict: 'A',
        require: ['^quickGrid', 'quickPaging'],
        controller: function () {},
        scope: true,
        controllerAs: 'quickPaging',
        templateUrl: '/quick-grid/quick-grid-footer.html',
        link: function ($scope, $element, $attrs, controllers) {
          var quickGrid = controllers[0];
          var selfController = controllers[1];
          selfController.searchModel = quickGrid.searchModel;
        }
      };
    });
})();