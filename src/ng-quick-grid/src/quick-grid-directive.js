function directive() {
    return {
        restrict: 'A',
        scope: true,
        controllerAs: 'grid',
        controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
            this.searchModel = $scope.$eval($attrs.gridModel);
        }]
    };
}

export default directive;