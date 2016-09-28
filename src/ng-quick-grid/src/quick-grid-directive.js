function directive() {
    return {
        restrict: 'A',
        scope: true,
        controllerAs: 'grid',
        controller: function($scope, $element, $attrs) {
            this.searchModel = $scope.$eval($attrs.gridModel);
        }
    };
}

export default directive;