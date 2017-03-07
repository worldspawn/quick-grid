import angular from 'angular';

function directive() {
    return {
        restrict: 'A',
        scope: true,
        controllerAs: 'grid',
        bindToController: true,
        controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
            this.searchModel = $scope.$eval($attrs.gridModel);
        }],
        link: function (scope, element) {
            var body = angular.element(element[0].ownerDocument.querySelector('body'));
            var bodyOff = (ev) => {
                console.log(ev);
                element.removeClass('ctrl-hover');
                body.off('keyup', bodyOff);
            };

            element.on('mousemove', (ev) => {
                if (ev.ctrlKey) {
                    scope.$apply(() => {
                        if (!element.hasClass('ctrl-hover')) {
                            element.addClass('ctrl-hover');
                            
                            body.on('keyup', bodyOff);
                        }
                    });
                }
                else {
                    element.removeClass('ctrl-hover');
                    body.off('keyup', bodyOff);
                }
            });

            element.on('mouseout', (ev) => {
                var e = ev.toElement;
                while (e !== null && e !== element[0]) {
                    e = e.parentElement;
                }

                if (e === element[0]) {
                    return;
                }
                
                scope.$apply(() => {
                    element.removeClass('ctrl-hover');
                    body.off('keyup', bodyOff); 
                });
            });
        }
    };
}

export default directive;