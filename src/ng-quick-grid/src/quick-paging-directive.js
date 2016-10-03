import template from './quick-grid-footer.html';

function directive() {
    return {
        restrict: 'A',
        require: ['^quickGrid', 'quickPaging'],
        controller: ['$scope', function($scope) {
            this.maxItems = this.maxItems || 10;
            this.startRange = [];
            this.endRange = [];
            this.midRange = [];

            this.drawStartRange = [];
            this.drawMidRange = [];
            this.drawEndRange = [];

            var initWatch = $scope.$watch(() => this.searchModel, (newValue, oldValue) => {
                initWatch();
                initWatch = null;

                var pagingWatch;

                pagingWatch = $scope.$watch(() => this.searchModel.pageCount.length, (newValue, oldValue) => {
                    if (newValue === oldValue) {
                        return;
                    }

                    if (newValue > this.maxItems) {
                        this.startRange = [];
                        this.endRange = [];
                        var max = Math.floor((this.maxItems -3) / 2);
                        var i;
                        
                        for (i = 1; i <= max; i++) {
                            this.startRange.push(i);
                        }

                        var endStart = newValue;
                        
                        if (this.maxItems % 2 === 0) {
                            var mid = newValue / 2;
                            if (mid % 1 == 0) {
                                this.midRange = [mid -1, mid, mid +1];
                            }
                            else {
                                this.midRange = [mid -1.5, mid -0.5, mid +0.5];
                            }
                        }
                        else {
                            var mid = newValue / 2;
                            
                            if (mid % 1 == 0) {
                                this.midRange = [mid -1, mid, mid +1];
                            }
                            else {
                                this.midRange = [mid -1.5, mid -0.5, mid +0.5];
                            }

                            endStart++;
                        }

                        for (var i = endStart - max; i <= newValue; i++) {
                            this.endRange.push(i);
                        }
                    }
                });

                $scope.$watch(() => this.searchModel.paging.pageIndex, (newValue, oldValue) => {
                    newValue = newValue +1;
                    this.drawStartRange = this.startRange.slice(0);
                    this.drawEndRange = this.endRange.slice(0);
                    this.drawMidRange = this.midRange.slice(0);

                    if (this.drawStartRange.indexOf(newValue) > -1 || this.drawEndRange.indexOf(newValue) > -1) {
                        return;
                    }

                    if (this.drawStartRange[this.drawStartRange.length - 1] === newValue -1) {//ranges touch
                        this.drawStartRange.push(newValue);
                        this.drawStartRange.push(newValue + 1);
                        this.drawMidRange = [];

                        var x = this.drawEndRange[0];
                        var padAmount = this.maxItems - this.drawStartRange.length - this.drawEndRange.length;

                        for (var i = 1; i <= padAmount; i++) {
                            this.drawEndRange.unshift(x - i);
                        }

                        return;
                    }

                    if (this.drawEndRange[0] === newValue +1) {//ranges touch
                        this.drawEndRange.unshift(newValue);
                        this.drawEndRange.unshift(newValue -1);
                        this.drawMidRange = [];

                        var x = this.drawStartRange[this.drawStartRange.length - 1];
                        var padAmount = this.maxItems - this.drawStartRange.length - this.drawEndRange.length;

                        for (var i = 1; i <= padAmount; i++) {
                            this.drawStartRange.push(x + i);
                        }

                        return;
                    }

                    if (this.drawMidRange.indexOf(newValue) === -1) {
                        this.drawMidRange = [newValue -1, newValue, newValue +1]
                    }
                });
            });
        }],
        scope: {
            maxItems: '<?quickPaging'
        },
        controllerAs: 'quickPaging',
        bindToController: true,
        template,
        link: function($scope, $element, $attrs, controllers) {
            var quickGrid = controllers[0];
            var selfController = controllers[1];
            selfController.searchModel = quickGrid.searchModel;
        }
    };
}

export default directive;