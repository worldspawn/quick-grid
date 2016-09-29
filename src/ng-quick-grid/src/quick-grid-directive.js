function directive() {
    return {
        restrict: 'A',
        scope: true,
        controllerAs: 'grid',
        bindToController: true,
        controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
            this.searchModel = $scope.$eval($attrs.gridModel);
        }]
    };
}

export default directive;