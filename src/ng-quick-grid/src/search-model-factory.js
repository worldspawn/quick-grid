(function () {
  'use strict';

  function PagingModel(defaultSortBy) {
    this.sort(defaultSortBy);
  }

  function SearchModel(defaultSortBy, defaultModel) {
    this.model = defaultModel || {};
    this.paging = new PagingModel(defaultSortBy);
    this.pageCount = [];
  }

  SearchModel.prototype = {
    attachToScope: function ($scope, cb) {
      var self = this;
      $scope.$watch(function () {
        return self.model;
      }, function (newValue) {
        self.paging.pageIndex = 0;
        cb(newValue, self.paging, true)
          .then(function (result) {
            self.pageCount.length = result.pageCount;
          });
      }, true);

      $scope.$watch(function () {
        return self.paging;
      }, function (newValue, oldValue) {
        if (newValue.sortBy !== oldValue.sortBy || newValue.pageIndex !== oldValue.pageIndex) {
          cb(self.model, newValue, false);
        }
      }, true);
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