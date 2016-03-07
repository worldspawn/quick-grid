(function () {
  /* globals describe, it, beforeEach, afterEach, inject, expect, angular */
  'use strict';

  describe('ngQuickGrid', function () {
    var model;
    var scope;
    beforeEach(module('ngQuickGrid'));
    beforeEach(inject(function (SearchModel, $rootScope) {
      scope = $rootScope.$new();
      model = {
        search: new SearchModel('Name desc'),
        results: null
      };
    }));

    afterEach(function () {
      scope.$destroy();
    });

    it('should trigger a query when the model changes', function (done) {
      inject(function ($rootScope, $compile, $q) {
        scope.model = model;
        var q = $q.defer();
        q.reject('test');
        var weAreDone = false;
        var element = angular.element('<table quick-grid grid-model="model.search"></table>');
        element = $compile(element)(scope);

        function search(obj) {
          if (obj.name === 'Foo' && !weAreDone) {
            weAreDone = true;
            done();
          }

          return q.promise;
        }

        model.search.attachToScope(scope, search);
        model.search.model.name = 'Foo';
        scope.$digest();
      });
    });

    it('should trigger a query when the filters change', function (done) {
      inject(function ($rootScope, $compile, $q) {
        /* jshint sub: true */
        scope.model = model;
        var q = $q.defer();
        q.reject('test');
        var weAreDone = false;

        var element = angular.element('<table quick-grid grid-model="model.search"></table>');
        element = $compile(element)(scope);

        function search(obj) {
          var filterSet = obj.filters && obj.filters.Name && obj.filters.Name.value === 'Foo';
          if (filterSet && !weAreDone) {
            weAreDone = true;
            done();
          }

          return q.promise;
        }

        model.search.addFilter('Name', '%', 'Fred');
        model.search.attachToScope(scope, search);
        scope.$digest();
        expect(model.search.filters['Name'].value).toBe('Fred');
        model.search.filters['Name'].value = 'Foo';
        scope.$digest();
      });
    });

    it('should convert value when serializing to json', function () {
      inject(function () {
        /* jshint sub: true */
        model.search.addFilter('Name', '%', 'Fred');
        expect(model.search.filters['Name'].toJSON()).toBe('%Fred%');
      });
    });

    it('should convert contains value when serializing to json', function () {
      inject(function () {
        /* jshint sub: true */
        model.search.addFilter('Name', '%', 'Fred');
        expect(model.search.filters['Name'].toJSON()).toBe('%Fred%');
      });
    });

    it('should convert startswith value when serializing to json', function () {
      inject(function () {
        /* jshint sub: true */
        model.search.addFilter('Name', '~%', 'Fred');
        expect(model.search.filters['Name'].toJSON()).toBe('Fred%');
      });
    });

    it('should convert endswith value when serializing to json', function () {
      inject(function () {
        /* jshint sub: true */
        model.search.addFilter('Name', '%~', 'Fred');
        expect(model.search.filters['Name'].toJSON()).toBe('%Fred');
      });
    });

    it('should convert endswith value when serializing to json', function () {
      inject(function () {
        /* jshint sub: true */
        model.search.addFilter('Name', '()', ['Fred', 'Ted']);
        expect(model.search.filters['Name'].toJSON()).toBe('(Fred,Ted)');
      });
    });

    it('should convert equals value when serializing to json', function () {
      inject(function () {
        /* jshint sub: true */
        model.search.addFilter('Name', '=', 'Fred');
        expect(model.search.filters['Name'].toJSON()).toBe('=Fred');
      });
    });
  });
})();