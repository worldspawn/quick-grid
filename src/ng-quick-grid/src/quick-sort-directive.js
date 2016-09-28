function directive($compile) {
    return {
        restrict: 'A',
        require: '^quickGrid',
        link: ['$scope', '$element', '$attrs', 'quickGrid', function($scope, $element, $attrs, quickGrid) {
            var sortBy = $attrs.quickSort;
            var carets = angular.element('<span ng-if="grid.searchModel.paging.sortBy.toLowerCase().indexOf(\'' + sortBy.toLowerCase() + '\') === 0"><i class="glyphicon glyphicon-triangle-bottom" ng-if="grid.searchModel.paging.sortBy.toLowerCase().indexOf(\'desc\') > -1"></i><i class="glyphicon glyphicon-triangle-top" ng-if="grid.searchModel.paging.sortBy.toLowerCase().indexOf(\'desc\') === -1"></i></span>');
            $element.append($compile(carets)($scope));
            $element.on('click', function() {
                $scope.$apply(function() {
                    quickGrid.searchModel.paging.sort(sortBy);
                });
            });
        }]
    };
}

directive.$inject = ['$compile'];

export default directive;