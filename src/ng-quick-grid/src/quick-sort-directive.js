function directive($compile) {
    return {
        restrict: 'A',
        require: '^quickGrid',
        scope: true,
        templateSource: `<span ng-if="grid.searchModel.paging.isSorting(sortBy.toLowerCase()) !== false">        
            <i class="glyphicon glyphicon-triangle-bottom" ng-if="grid.searchModel.paging.sortBy[grid.searchModel.paging.isSorting(sortBy.toLowerCase())].indexOf(\'desc\') > -1"></i>
            <i class="glyphicon glyphicon-triangle-top" ng-if="grid.searchModel.paging.sortBy[grid.searchModel.paging.isSorting(sortBy.toLowerCase())].indexOf(\'desc\') === -1"></i>
            </span>`,
        link: function($scope, $element, $attrs, quickGrid) {
            $scope.sortBy = $attrs.quickSort;
            var carets = angular.element(this.templateSource);
            $element.append($compile(carets)($scope));
            $element.on('click', (ev) => {
                $scope.$apply(() => {
                    quickGrid.searchModel.paging.sort($scope.sortBy, !ev.ctrlKey);
                });
            });

            $scope.$watch(() => $scope.grid.searchModel.paging.isSorting($scope.sortBy.toLowerCase()), (v) => {
                $element.removeClass('active-1');
                $element.removeClass('active-2');
                $element.removeClass('active-3');

                if (v === false) {
                    $element.removeClass('active');                    
                }
                else {
                    $element.addClass('active');
                    $element.addClass('active-' + (v+1));
                }
            });
        }
    };
}

directive.$inject = ['$compile'];

export default directive;