/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _angular = __webpack_require__(1);
	
	var _angular2 = _interopRequireDefault(_angular);
	
	var _quickGridDirective = __webpack_require__(2);
	
	var _quickGridDirective2 = _interopRequireDefault(_quickGridDirective);
	
	var _quickPagingDirective = __webpack_require__(3);
	
	var _quickPagingDirective2 = _interopRequireDefault(_quickPagingDirective);
	
	var _quickSortDirective = __webpack_require__(5);
	
	var _quickSortDirective2 = _interopRequireDefault(_quickSortDirective);
	
	var _searchModelFactory = __webpack_require__(6);
	
	var _searchModelFactory2 = _interopRequireDefault(_searchModelFactory);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = _angular2.default.module('ngQuickGrid', []).directive('quickGrid', _quickGridDirective2.default).directive('quickPaging', _quickPagingDirective2.default).directive('quickSort', _quickSortDirective2.default).factory('SearchModel', _searchModelFactory2.default);

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = angular;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	function directive() {
	    return {
	        restrict: 'A',
	        scope: true,
	        controllerAs: 'grid',
	        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
	            this.searchModel = $scope.$eval($attrs.gridModel);
	        }]
	    };
	}
	
	exports.default = directive;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _quickGridFooter = __webpack_require__(4);
	
	var _quickGridFooter2 = _interopRequireDefault(_quickGridFooter);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function directive() {
	    return {
	        restrict: 'A',
	        require: ['^quickGrid', 'quickPaging'],
	        controller: function controller() {},
	        scope: true,
	        controllerAs: 'quickPaging',
	        template: _quickGridFooter2.default,
	        link: function link($scope, $element, $attrs, controllers) {
	            var quickGrid = controllers[0];
	            var selfController = controllers[1];
	            selfController.searchModel = quickGrid.searchModel;
	        }
	    };
	}
	
	exports.default = directive;

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = "<div class=\"btn-group\" ng-if=\"quickPaging.searchModel.pageCount.length > 1\">\r\n  <button ng-repeat=\"x in quickPaging.searchModel.pageCount track by $index\" ng-click=\"quickPaging.searchModel.paging.toPage($index)\" ng-disabled=\"$index === quickPaging.searchModel.paging.pageIndex\" class=\"btn btn-primary btn-sm\">{{$index + 1}}</button>\r\n</div>\r\n"

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	function directive($compile) {
	    return {
	        restrict: 'A',
	        require: '^quickGrid',
	        link: function link($scope, $element, $attrs, quickGrid) {
	            var sortBy = $attrs.quickSort;
	            var carets = angular.element('<span ng-if="grid.searchModel.paging.sortBy.toLowerCase().indexOf(\'' + sortBy.toLowerCase() + '\') === 0"><i class="glyphicon glyphicon-triangle-bottom" ng-if="grid.searchModel.paging.sortBy.toLowerCase().indexOf(\'desc\') > -1"></i><i class="glyphicon glyphicon-triangle-top" ng-if="grid.searchModel.paging.sortBy.toLowerCase().indexOf(\'desc\') === -1"></i></span>');
	            $element.append($compile(carets)($scope));
	            $element.on('click', function () {
	                $scope.$apply(function () {
	                    quickGrid.searchModel.paging.sort(sortBy);
	                });
	            });
	        }
	    };
	}
	
	directive.$inject = ['$compile'];
	
	exports.default = directive;

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var PrefixOperator = function () {
	    function PrefixOperator(value, operator) {
	        _classCallCheck(this, PrefixOperator);
	
	        this.value = value;
	        this.operator = operator;
	    }
	
	    _createClass(PrefixOperator, [{
	        key: 'setNot',
	        value: function setNot(not) {
	            this.not = not;
	        }
	    }, {
	        key: 'toggleNot',
	        value: function toggleNot() {
	            this.not = !this.not;
	        }
	    }, {
	        key: 'toJSON',
	        value: function toJSON() {
	            if (this.value === null || this.value === undefined || this.value === '') {
	                return undefined;
	            }
	            var value = this.value;
	            return this.operator + value;
	        }
	    }]);
	
	    return PrefixOperator;
	}();
	
	var operators = {
	    '%': function _(value) {
	        this.value = value;
	        this.toJSON = function () {
	            if (this.value === null || this.value === undefined || this.value === '') {
	                return undefined;
	            }
	            var value = this.value;
	            return '%' + value + '%';
	        };
	    },
	    '%~': function _(value) {
	        this.value = value;
	        this.toJSON = function () {
	            if (this.value === null || this.value === undefined || this.value === '') {
	                return undefined;
	            }
	            var value = this.value;
	            return '%' + value;
	        };
	    },
	    '~%': function _(value) {
	        this.value = value;
	        this.toJSON = function () {
	            if (this.value === null || this.value === undefined || this.value === '') {
	                return undefined;
	            }
	            var value = this.value;
	            return value + '%';
	        };
	    },
	    '()': function _(value) {
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
	
	Object.keys(operators).forEach(function (key) {
	    operators[key].prototype = PrefixOperator;
	});
	
	var PagingModel = function () {
	    function PagingModel(defaultSortBy) {
	        _classCallCheck(this, PagingModel);
	
	        this.sort(defaultSortBy);
	    }
	
	    _createClass(PagingModel, [{
	        key: 'sort',
	        value: function sort(by) {
	            if (by === null || by === undefined) {
	                delete this.sortBy;
	            } else {
	                if (by === this.sortBy) {
	                    this.sortBy = by + ' desc';
	                } else {
	                    this.sortBy = by;
	                }
	            }
	        }
	    }, {
	        key: 'toPage',
	        value: function toPage(pageIndex) {
	            this.pageIndex = pageIndex;
	        }
	    }]);
	
	    return PagingModel;
	}();
	
	var SearchModel = function () {
	    function SearchModel(callback, defaultSortBy, defaultModel) {
	        _classCallCheck(this, SearchModel);
	
	        this.model = defaultModel || {};
	        this.paging = new PagingModel(defaultSortBy);
	        this.pageCount = [];
	        this.filters = {};
	        this.callback = callback;
	    }
	
	    _createClass(SearchModel, [{
	        key: 'watch',
	        value: function watch(scope) {
	            this.scope = scope;
	            this.attachOtherWatchers();
	            this.attachPagingWatch();
	            return this;
	        }
	    }, {
	        key: 'addFilter',
	        value: function addFilter(key, operator, value) {
	            var Constructor = operators[operator] || PrefixOperator;
	            this.filters[key] = new Constructor(value, operator);
	            return this;
	        }
	    }, {
	        key: 'apply',
	        value: function apply(reset) {
	            if (this.pagingWatchHandle) {
	                this.pagingWatchHandle();
	            }
	            if (reset) {
	                this.paging.pageIndex = 0;
	                this.paging.filterHash = null;
	            }
	            this.callback(this).then(this.updatePaging.bind(this)).then(this.attachPagingWatch.bind(this));
	        }
	    }, {
	        key: 'toQueryString',
	        value: function toQueryString() {
	            var _this = this;
	
	            //note model is not output in the query string, i'd have to build a deep converter and i can't be arsed. just use filters! :P
	            var segments = [];
	            var filterCount = 0;
	            Object.keys(this.filters).forEach(function (key) {
	                var value = _this.filters[key].toJSON();
	                if (value !== undefined) {
	                    var not = _this.filters[key].not ? '!' : '';
	                    var name = 'filters[' + filterCount++ + ']';
	                    segments.push(name + '.key=' + escape(key));
	                    segments.push(name + '.value=' + escape(not + value));
	                }
	            });
	
	            if (this.model) {
	                Object.keys(this.model).forEach(function (key) {
	                    var value = _this.model[key].toJSON();
	                    if (value !== undefined) {
	                        segments.push(escape(key) + '=' + escape(value));
	                    }
	                });
	            }
	
	            segments.push('paging.pageIndex=' + (this.paging.pageIndex || 0));
	            segments.push('paging.sortBy=' + escape(this.paging.sortBy || ''));
	            segments.push('paging.filterHash=' + escape(this.paging.filterHash || ''));
	
	            return segments.join('&');
	        }
	    }, {
	        key: 'toJSON',
	        value: function toJSON() {
	            var _this2 = this;
	
	            var result = {
	                paging: this.paging,
	                filters: this.filters
	            };
	
	            Object.keys(this.model).forEach(function (key) {
	                result[key] = _this2.model[key];
	            });
	
	            return result;
	        }
	    }, {
	        key: 'attachOtherWatchers',
	        value: function attachOtherWatchers() {
	            var _this3 = this;
	
	            this.modelWatchHandle = this.scope.$watch(function () {
	                return _this3.model;
	            }, this.onChange.bind(this), true);
	
	            this.filterWatchHandle = this.scope.$watch(function () {
	                return _this3.filters;
	            }, this.onChange.bind(this), true);
	        }
	    }, {
	        key: 'attachPagingWatch',
	        value: function attachPagingWatch() {
	            var _this4 = this;
	
	            if (!this.scope) {
	                return;
	            }
	            this.pagingWatchHandle = this.scope.$watch(function () {
	                return _this4.paging;
	            }, function (newValue, oldValue) {
	                if (newValue.sortBy !== oldValue.sortBy || newValue.pageIndex !== oldValue.pageIndex) {
	                    _this4.apply(false);
	                }
	            }, true);
	        }
	    }, {
	        key: 'updatePaging',
	        value: function updatePaging(result) {
	            if (result.pageCount !== null) {
	                this.pageCount.length = result.pageCount;
	            }
	
	            this.paging.filterHash = result.filterHash;
	        }
	    }, {
	        key: 'onChange',
	        value: function onChange(newValue, oldValue) {
	            if (newValue === oldValue) {
	                return;
	            }
	            this.apply(true);
	        }
	    }]);
	
	    return SearchModel;
	}();
	
	exports.default = function () {
	    return SearchModel;
	};

/***/ }
/******/ ]);
//# sourceMappingURL=ng-quick-grid.js.map