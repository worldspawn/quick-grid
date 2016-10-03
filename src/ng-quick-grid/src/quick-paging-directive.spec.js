import angular from 'angular';
import 'angular-mocks';
import app from './app.js'

describe('ngQuickGrid', function () {
    var model;
    beforeEach(angular.mock.module('ngQuickGrid'));
    beforeEach(inject(function (SearchModel) {
      model = {
        search: new SearchModel('Name desc'),
        results: null
      };
    }));

    describe('quickPagingDirective', function () {
      it('model is applied to controller', inject(function ($rootScope, $compile, $templateCache) {
        var scope = $rootScope.$new();
        scope.model = model;

        var element = angular.element('<table quick-grid grid-model="model.search"><tfoot><tr><td colspan="6" class="text-center" quick-paging></td></tr></tfoot></table>');
        element = $compile(element)(scope);
        $rootScope.$digest();
        
        var td = element[0].querySelector('tfoot td');
        var footScope = angular.element(td).isolateScope();

        expect(footScope.quickPaging).not.toBeUndefined();
        expect(footScope.quickPaging.searchModel).toEqual(scope.model.search);
      }));

      it ('should calculate paging ranges correctly', inject(function ($rootScope, $compile, $templateCache) {
        var scope = $rootScope.$new();
        scope.model = model;

        var element = angular.element('<table quick-grid grid-model="model.search"><tfoot><tr><td colspan="6" class="text-center" quick-paging="15"></td></tr></tfoot></table>');
        element = $compile(element)(scope);
        $rootScope.$digest();
        
        //when reading this remember the page index is an 0 based index. the page number is not
        var td = element[0].querySelector('tfoot td');
        var footScope = angular.element(td).isolateScope();
        model.search.pageCount = Array(20);
        $rootScope.$digest();

        model.search.paging.pageIndex = 7;
        $rootScope.$digest();
        expect(footScope.quickPaging.drawMidRange[0]).toBe(7);

        model.search.paging.pageIndex = 10;
        $rootScope.$digest();
        expect(footScope.quickPaging.drawMidRange[0]).toBe(9);//should not change

        model.search.paging.pageIndex = 11;
        $rootScope.$digest();
        expect(footScope.quickPaging.drawMidRange[0]).toBe(11);

        model.search.paging.pageIndex = 6;
        $rootScope.$digest();
        expect(footScope.quickPaging.drawMidRange.length).toBe(0);
        expect(footScope.quickPaging.drawStartRange[footScope.quickPaging.drawStartRange.length -1]).toBe(8);
      }));

      it ('should draw paging correctly', inject(function ($rootScope, $compile, $templateCache) {
        var scope = $rootScope.$new();
        scope.model = model;

        var element = angular.element('<table quick-grid grid-model="model.search"><tfoot><tr><td colspan="6" class="text-center" quick-paging="15"></td></tr></tfoot></table>');
        element = $compile(element)(scope);
        $rootScope.$digest();
        
        //when reading this remember the page index is an 0 based index. the page number is not
        var td = element[0].querySelector('tfoot td');
        var footScope = angular.element(td).isolateScope();
        model.search.pageCount = Array(20);
        model.search.paging.pageIndex = 7;
        $rootScope.$digest();
        
        expect(td.querySelectorAll('span.startRange button').length).toBe(6);
        expect(td.querySelectorAll('span.midRange button').length).toBe(3);
        expect(td.querySelectorAll('span.endRange button').length).toBe(6);
        
        model.search.paging.pageIndex = 10;
        $rootScope.$digest();
        expect(td.querySelectorAll('span.startRange button').length).toBe(6);
        expect(td.querySelectorAll('span.midRange button').length).toBe(3);
        expect(td.querySelectorAll('span.endRange button').length).toBe(6);


        model.search.paging.pageIndex = 11;
        $rootScope.$digest();
        expect(td.querySelectorAll('span.startRange button').length).toBe(6);
        expect(td.querySelectorAll('span.midRange button').length).toBe(3);
        expect(td.querySelectorAll('span.endRange button').length).toBe(6);
        
        model.search.paging.pageIndex = 6;
        $rootScope.$digest();

        expect(td.querySelectorAll('span.startRange button').length).toBe(8);
        expect(td.querySelectorAll('span.midRange button').length).toBe(0);
        expect(td.querySelectorAll('span.endRange button').length).toBe(7);//end gets padded

        model.search.paging.pageIndex = 13;
        $rootScope.$digest();
        expect(td.querySelectorAll('span.startRange button').length).toBe(7);
        expect(td.querySelectorAll('span.midRange button').length).toBe(0);
        expect(td.querySelectorAll('span.endRange button').length).toBe(8);
      }));

      it ('should have only integer page numbers (even max, odd page count)', inject(function ($rootScope, $compile, $templateCache) {
        var scope = $rootScope.$new();
        scope.model = model;
        

        var element = angular.element('<table quick-grid grid-model="model.search"><tfoot><tr><td colspan="6" class="text-center" quick-paging></td></tr></tfoot></table>');
        element = $compile(element)(scope);
        $rootScope.$digest();
        
        //when reading this remember the page index is an 0 based index. the page number is not
        var td = element[0].querySelector('tfoot td');
        var footScope = angular.element(td).isolateScope();
        model.search.pageCount = Array(221);
        model.search.paging.pageIndex = 0;
        $rootScope.$digest();

        footScope.quickPaging.drawStartRange.forEach((x) => {
            expect(x % 1).toBe(0);
        });

        footScope.quickPaging.drawMidRange.forEach((x) => {
            expect(x % 1).toBe(0);
        });        

        footScope.quickPaging.drawEndRange.forEach((x) => {
            expect(x % 1).toBe(0);
        });
      }));

      it ('should have only integer page numbers (even max, even page count)', inject(function ($rootScope, $compile, $templateCache) {
        var scope = $rootScope.$new();
        scope.model = model;
        

        var element = angular.element('<table quick-grid grid-model="model.search"><tfoot><tr><td colspan="6" class="text-center" quick-paging></td></tr></tfoot></table>');
        element = $compile(element)(scope);
        $rootScope.$digest();
        
        //when reading this remember the page index is an 0 based index. the page number is not
        var td = element[0].querySelector('tfoot td');
        var footScope = angular.element(td).isolateScope();
        model.search.pageCount = Array(220);
        model.search.paging.pageIndex = 0;
        $rootScope.$digest();

        footScope.quickPaging.drawStartRange.forEach((x) => {
            expect(x % 1).toBe(0);
        });

        footScope.quickPaging.drawMidRange.forEach((x) => {
            expect(x % 1).toBe(0);
        });        

        footScope.quickPaging.drawEndRange.forEach((x) => {
            expect(x % 1).toBe(0);
        });
      }));

      it ('should have only integer page numbers (odd max, even page count)', inject(function ($rootScope, $compile, $templateCache) {
        var scope = $rootScope.$new();
        scope.model = model;
        

        var element = angular.element('<table quick-grid grid-model="model.search"><tfoot><tr><td colspan="6" class="text-center" quick-paging="11"></td></tr></tfoot></table>');
        element = $compile(element)(scope);
        $rootScope.$digest();
        
        //when reading this remember the page index is an 0 based index. the page number is not
        var td = element[0].querySelector('tfoot td');
        var footScope = angular.element(td).isolateScope();
        model.search.pageCount = Array(220);
        model.search.paging.pageIndex = 0;
        $rootScope.$digest();

        footScope.quickPaging.drawStartRange.forEach((x) => {
            expect(x % 1).toBe(0);
        });

        footScope.quickPaging.drawMidRange.forEach((x) => {
            expect(x % 1).toBe(0);
        });        

        footScope.quickPaging.drawEndRange.forEach((x) => {
            expect(x % 1).toBe(0);
        });
      }));

      it ('should have only integer page numbers (odd max, odd page count)', inject(function ($rootScope, $compile, $templateCache) {
        var scope = $rootScope.$new();
        scope.model = model;
        

        var element = angular.element('<table quick-grid grid-model="model.search"><tfoot><tr><td colspan="6" class="text-center" quick-paging="11"></td></tr></tfoot></table>');
        element = $compile(element)(scope);
        $rootScope.$digest();
        
        //when reading this remember the page index is an 0 based index. the page number is not
        var td = element[0].querySelector('tfoot td');
        var footScope = angular.element(td).isolateScope();
        model.search.pageCount = Array(221);
        model.search.paging.pageIndex = 0;
        $rootScope.$digest();

        footScope.quickPaging.drawStartRange.forEach((x) => {
            expect(x % 1).toBe(0);
        });

        footScope.quickPaging.drawMidRange.forEach((x) => {
            expect(x % 1).toBe(0);
        });        

        footScope.quickPaging.drawEndRange.forEach((x) => {
            expect(x % 1).toBe(0);
        });
      }));

    });
   });
