(function () {
  'use strict';

  var operatorPrototype = {
    setNot: function (not) {
      this.not = not;
    },
    toggleNot: function () {
      this.not = !this.not;
    }
  };

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
  PrefixOperator.prototype = operatorPrototype;

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

  Object.keys(operators)
    .forEach(function (key) {
      operators[key].prototype = operatorPrototype;
    });

  function PagingModel(defaultSortBy) {
    this.sort(defaultSortBy);
  }

  function updatePaging(result) {
    /* jshint validthis: true */
    if (result.pageCount !== null) {
      this.pageCount.length = result.pageCount;
    }

    this.paging.filterHash = result.filterHash;
  }

  function attachPagingWatch() {
    /* jshint validthis: true */
    if (!this.scope) {
      return;
    }
    this.pagingWatchHandle = this.scope.$watch(function () {
      return this.paging;
    }.bind(this), function (newValue, oldValue) {
      if (newValue.sortBy !== oldValue.sortBy || newValue.pageIndex !== oldValue.pageIndex) {
        this.apply(false);
      }
    }.bind(this), true);
  }

  function onChange(newValue, oldValue) {
    /* jshint validthis: true */
    if (newValue === oldValue) {
      return;
    }
    this.apply(true);
  }

  function attachOtherWatchers() {
    /* jshint validthis: true */
    this.modelWatchHandle = this.scope.$watch(function () {
      return this.model;
    }.bind(this), onChange.bind(this), true);

    this.filterWatchHandle = this.scope.$watch(function () {
      return this.filters;
    }.bind(this), onChange.bind(this), true);
  }

  function SearchModel(callback, defaultSortBy, defaultModel) {
    this.model = defaultModel || {};
    this.paging = new PagingModel(defaultSortBy);
    this.pageCount = [];
    this.filters = {};
    this.callback = callback;
  }

  SearchModel.prototype = {
    watch: function (scope) {
      this.scope = scope;
      attachOtherWatchers.call(this);
      attachPagingWatch.call(this);
      return this;
    },
    addFilter: function (key, operator, value) {
      var Constructor = operators[operator] || PrefixOperator;
      this.filters[key] = new Constructor(value, operator);
      return this;
    },
    apply: function (reset) {
      if (this.pagingWatchHandle) {
        this.pagingWatchHandle();
      }
      if (reset) {
        this.paging.pageIndex = 0;
        this.paging.filterHash = null;
      }
      this.callback(this)
        .then(updatePaging.bind(this))
        .then(attachPagingWatch.bind(this));
    },
    toQueryString: function () {
      /* jshint validthis: true */
      //note model is not output in the query string, i'd have to build a deep converter and i can't be arsed. just use filters! :P
      var segments = [];
      var filterCount = 0;
      Object.keys(this.filters)
        .forEach(function (key) {
          var name = 'filters[' + filterCount+++']';
          var value = this.filters[key].toJSON();
          if (value !== undefined) {
            var not = this.filters[key].not ? '!' : '';
            segments.push(name + '.key=' + escape(key));
            segments.push(name + '.value=' + escape(not + value));
          }
        }.bind(this));

      if (this.model) {
        Object.keys(this.model)
          .forEach(function (key) {
            var value = this.model[key].toJSON();
            if (value !== undefined) {
              segments.push(escape(key) + '=' + escape(value));
            }
          }.bind(this));
      }

      segments.push('paging.pageIndex=' + (this.paging.pageIndex || 0));
      segments.push('paging.sortBy=' + escape(this.paging.sortBy || ''));
      segments.push('paging.filterHash=' + escape(this.paging.filterHash || ''));

      return segments.join('&');
    },
    toJSON: function () {
      return {
        model: this.model,
        paging: this.paging,
        filters: this.filters
      };
    }
  };

  PagingModel.prototype = {
    sort: function (by) {
      if (by === null || by === undefined) {
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
