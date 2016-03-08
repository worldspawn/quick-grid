(function () {
  'use strict';

  function PrefixOperator(value, operator) {
    this.value = value;
    this.toJSON = function () {
      if (this.value === null || this.value === undefined || this.value === '') {
        return undefined;
      }
      var value = this.value;
      return operator + value;
    };
  }

  var operators = {
    '%': function (value) {
      this.value = value;
      this.toJSON = function () {
        if (this.value === null || this.value === undefined || this.value === '') {
          return undefined;
        }
        var value = this.value;
        return '%' + value + '%';
      };
    },
    '%~': function (value) {
      this.value = value;
      this.toJSON = function () {
        if (this.value === null || this.value === undefined || this.value === '') {
          return undefined;
        }
        var value = this.value;
        return '%' + value;
      };
    },
    '~%': function (value) {
      this.value = value;
      this.toJSON = function () {
        if (this.value === null || this.value === undefined || this.value === '') {
          return undefined;
        }
        var value = this.value;
        return value + '%';
      };
    },
    '()': function (value) {
      this.value = value;
      this.toJSON = function () {
        if (this.value === null || this.value === undefined || this.value === '') {
          return undefined;
        }

        var values = [];
        this.value.forEach(function (x) {
          values.push(x);
        });
        return '(' + values.join(',') + ')';
      };
    }
  };

  function PagingModel(defaultSortBy) {
    this.sort(defaultSortBy);
  }

  function SearchModel(defaultSortBy, defaultModel) {
    this.model = defaultModel || {};
    this.paging = new PagingModel(defaultSortBy);
    this.pageCount = [];
    this.filters = {};
  }

  SearchModel.prototype = {
    addFilter: function (key, operator, value) {
      var Constructor = operators[operator] || PrefixOperator;
      this.filters[key] = new Constructor(value, operator);
    },
    attachToScope: function ($scope, cb, runNow) {
      var self = this;
      var pagingWatchHandle;

      function attachPagingWatch() {
        pagingWatchHandle = $scope.$watch(function () {
          return self.paging;
        }, function (newValue, oldValue) {
          if (newValue.sortBy !== oldValue.sortBy || newValue.pageIndex !== oldValue.pageIndex) {
            cb(angular.extend({}, self.model, {
              filters: self.filters
            }), newValue, false);
          }
        }, true);
      }

      function onChange(newValue, oldValue) {
        if (newValue === oldValue) {
          return;
        }
        if (pagingWatchHandle) {
          pagingWatchHandle();
        }
        self.paging.pageIndex = 0;
        self.paging.filterHash = null;
        cb(angular.extend({}, self.model, {
          filters: self.filters
        }), self.paging, true)
          .then(function (result) {
            if (result.pageCount !== null) {
              self.pageCount.length = result.pageCount;
            }

            self.paging.filterHash = result.filterHash;
            attachPagingWatch();
          });
      }

      $scope.$watch(function () {
        return self.model;
      }, onChange, true);

      $scope.$watch(function () {
        return self.filters;
      }, onChange, true);

      attachPagingWatch();

      if (runNow) {
        onChange(1, 2);
      }
    }
  };

  PagingModel.prototype = {
    sort: function (by) {
      if (by === null) {
        delete this.sortBy;
      } else {
        if (by === this.sortBy) {
          this.sortBy = by + ' desc';
        } else {
          this.sortBy = by;
        }
      }
    },
    toPage: function (pageIndex) {
      this.pageIndex = pageIndex;
    }
  };

  angular.module('ngQuickGrid')
    .factory('SearchModel', function () {
      return SearchModel;
    });
})();