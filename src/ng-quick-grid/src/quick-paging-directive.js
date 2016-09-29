import template from './quick-grid-footer.html';

function directive() {
    return {
        restrict: 'A',
        require: ['^quickGrid', 'quickPaging'],
        controller: function() {},
        scope: true,
        controllerAs: 'quickPaging',
        template,
        link: function($scope, $element, $attrs, controllers) {
            var quickGrid = controllers[0];
            var selfController = controllers[1];
            selfController.searchModel = quickGrid.searchModel;
        }
    };
}

export default directive;