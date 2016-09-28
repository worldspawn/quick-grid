import angular from 'angular';
import 'angular-mocks';
import app from './app.js'

describe('ngQuickGrid', function() {
    var model;

    beforeEach(angular.mock.module('ngQuickGrid'));
    beforeEach(inject((SearchModel) => {
        model = {
            search: new SearchModel('Name desc'),
            results: null
        };
    }));

    describe('quickGridDirective', function() {
        it('model is applied to controller', inject(($rootScope, $compile) => {
            var scope = $rootScope.$new();
            scope.model = model;

            var element = angular.element('<table quick-grid grid-model="model.search"></table>');
            element = $compile(element)(scope);

            expect(element.scope()).not.toBeNull();
            expect(element.scope().grid).not.toBeNull();
            expect(element.scope().grid.searchModel).toEqual(scope.model.search);
        }));
    });
});