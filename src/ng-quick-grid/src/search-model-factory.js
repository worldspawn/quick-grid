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
    this.toJSON = function () {
      return {
        model: this.model,
        paging: this.paging,
        filters: this.filters
      };
    }.bind(this);
    this.toQueryString = function () {
      //note model is not output in the query string, i'd have to build a deep converter and i can't be arsed. just use filters! :P
      var segments = [];
      Object.keys(this.filters)
        .forEach(function (key) {
          var name = 'filters[' + segments.length + ']';
          segments.push(name + '.key=' + key);
          segments.push(name + '.value=' + escape(this.filters[key].toJSON()));
        }.bind(this));

      segments.push('paging.pageIndex=' + (this.paging.pageIndex || ''));
      segments.push('paging.sortBy=' + escape(this.paging.sortBy || ''));
      segments.push('paging.filterHash=' + escape(this.paging.filterHash || ''));

      return segments.join('&');
    }.bind(this);
  }

  SearchModel.prototype = {
    addFilter: function (key, operator, value) {
      var Constructor = operators[operator] || PrefixOperator;
      this.filters[key] = new Constructor(value, operator);
    },
    attachToScope: function ($scope, cb, runNow) {
      var pagingWatchHandle;

      function attachPagingWatch() {
        /* jshint validthis: true */
        pagingWatchHandle = $scope.$watch(function () {
          return this.paging;
        }.bind(this), function (newValue, oldValue) {
          if (newValue.sortBy !== oldValue.sortBy || newValue.pageIndex !== oldValue.pageIndex) {
            cb(angular.extend({}, this.model, {
              filters: this.filters
            }), newValue, false);
          }
        }.bind(this), true);
      }

      function onChange(newValue, oldValue) {
        /* jshint validthis: true */
        if (newValue === oldValue) {
          return;
        }
        if (pagingWatchHandle) {
          pagingWatchHandle();
        }
        this.paging.pageIndex = 0;
        this.paging.filterHash = null;
        cb(this, true)
          .then(function (result) {
            if (result.pageCount !== null) {
              this.pageCount.length = result.pageCount;
            }

            this.paging.filterHash = result.filterHash;
            attachPagingWatch.call(this);
          }.bind(this));
      }

      $scope.$watch(function () {
        return this.model;
      }.bind(this), onChange.bind(this), true);

      $scope.$watch(function () {
        return this.filters;
      }.bind(this), onChange.bind(this), true);

      attachPagingWatch.call(this);

      if (runNow) {
        onChange.call(this, 1, 2);
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