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
	
	var _quickSortDirective = __webpack_require__(9);
	
	var _quickSortDirective2 = _interopRequireDefault(_quickSortDirective);
	
	var _searchModelFactory = __webpack_require__(10);
	
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
	        bindToController: true,
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
	
	__webpack_require__(5);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function directive() {
	    return {
	        restrict: 'A',
	        require: ['^quickGrid', 'quickPaging'],
	        controller: ['$scope', function ($scope) {
	            var _this = this;
	
	            this.maxItems = this.maxItems || 10;
	            this.startRange = [];
	            this.endRange = [];
	            this.midRange = [];
	
	            this.drawStartRange = [];
	            this.drawMidRange = [];
	            this.drawEndRange = [];
	
	            var initWatch = $scope.$watch(function () {
	                return _this.searchModel;
	            }, function (newValue, oldValue) {
	                initWatch();
	                initWatch = null;
	
	                var pagingWatch;
	
	                pagingWatch = $scope.$watch(function () {
	                    return _this.searchModel.pageCount.length;
	                }, function (newValue, oldValue) {
	                    if (newValue === oldValue) {
	                        return;
	                    }
	
	                    if (newValue > _this.maxItems) {
	                        _this.startRange = [];
	                        _this.endRange = [];
	                        var max = Math.floor((_this.maxItems - 3) / 2);
	                        var i;
	
	                        for (i = 1; i <= max; i++) {
	                            _this.startRange.push(i);
	                        }
	
	                        var endStart = newValue;
	
	                        if (_this.maxItems % 2 === 0) {
	                            var mid = newValue / 2;
	                            if (mid % 1 == 0) {
	                                _this.midRange = [mid - 1, mid, mid + 1];
	                            } else {
	                                _this.midRange = [mid - 1.5, mid - 0.5, mid + 0.5];
	                            }
	                        } else {
	                            var mid = newValue / 2;
	
	                            if (mid % 1 == 0) {
	                                _this.midRange = [mid - 1, mid, mid + 1];
	                            } else {
	                                _this.midRange = [mid - 1.5, mid - 0.5, mid + 0.5];
	                            }
	
	                            endStart++;
	                        }
	
	                        for (var i = endStart - max; i <= newValue; i++) {
	                            _this.endRange.push(i);
	                        }
	                    }
	                });
	
	                $scope.$watch(function () {
	                    return _this.searchModel.paging.pageIndex;
	                }, function (newValue, oldValue) {
	                    newValue = newValue + 1;
	                    _this.drawStartRange = _this.startRange.slice(0);
	                    _this.drawEndRange = _this.endRange.slice(0);
	                    _this.drawMidRange = _this.midRange.slice(0);
	
	                    if (_this.drawStartRange.indexOf(newValue) > -1 || _this.drawEndRange.indexOf(newValue) > -1) {
	                        return;
	                    }
	
	                    if (_this.drawStartRange[_this.drawStartRange.length - 1] === newValue - 1) {
	                        //ranges touch
	                        _this.drawStartRange.push(newValue);
	                        _this.drawStartRange.push(newValue + 1);
	                        _this.drawMidRange = [];
	
	                        var x = _this.drawEndRange[0];
	                        var padAmount = _this.maxItems - _this.drawStartRange.length - _this.drawEndRange.length;
	
	                        for (var i = 1; i <= padAmount; i++) {
	                            _this.drawEndRange.unshift(x - i);
	                        }
	
	                        return;
	                    }
	
	                    if (_this.drawEndRange[0] === newValue + 1) {
	                        //ranges touch
	                        _this.drawEndRange.unshift(newValue);
	                        _this.drawEndRange.unshift(newValue - 1);
	                        _this.drawMidRange = [];
	
	                        var x = _this.drawStartRange[_this.drawStartRange.length - 1];
	                        var padAmount = _this.maxItems - _this.drawStartRange.length - _this.drawEndRange.length;
	
	                        for (var i = 1; i <= padAmount; i++) {
	                            _this.drawStartRange.push(x + i);
	                        }
	
	                        return;
	                    }
	
	                    if (_this.drawMidRange.indexOf(newValue) === -1) {
	                        _this.drawMidRange = [newValue - 1, newValue, newValue + 1];
	                    }
	                });
	            });
	        }],
	        scope: {
	            maxItems: '<?quickPaging'
	        },
	        controllerAs: 'quickPaging',
	        bindToController: true,
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

	module.exports = "<nav aria-label=\"Page navigation\" ng-if=\"quickPaging.searchModel.pageCount.length > 1 && quickPaging.maxItems < quickPaging.searchModel.pageCount.length\">\r\n  <ul class=\"pagination\">\r\n  \t<li ng-disabled=\"quickPaging.searchModel.paging.pageIndex === 0\"><a ng-click=\"quickPaging.searchModel.paging.toPage(quickPaging.searchModel.paging.pageIndex - 1)\">&laquo;</a></li>\r\n  \t<li class=\"startRange\" ng-repeat=\"x in quickPaging.drawStartRange track by $index\" ng-class=\"{'active': (x-1) === quickPaging.searchModel.paging.pageIndex}\"><a ng-click=\"quickPaging.searchModel.paging.toPage(x-1)\">{{x}}</a></li>\r\n  \t<li class=\"separator\" disabled=\"disabled\"><span>...</span></li>\r\n  \t<li class=\"midRange\" ng-repeat=\"x in quickPaging.drawMidRange track by $index\" ng-class=\"{'active': (x-1) === quickPaging.searchModel.paging.pageIndex}\"><a ng-click=\"quickPaging.searchModel.paging.toPage(x-1)\">{{x}}</a></li>\r\n  \t<li class=\"separator\" disabled=\"disabled\" ng-if=\"quickPaging.drawMidRange.length > 0\"><span>...</span></li>\r\n\t<li class=\"endRange\" ng-repeat=\"x in quickPaging.drawEndRange track by $index\" ng-class=\"{'active': (x-1) === quickPaging.searchModel.paging.pageIndex}\"><a ng-click=\"quickPaging.searchModel.paging.toPage(x-1)\">{{x}}</a></li>\r\n\t<li ng-disabled=\"(quickPaging.searchModel.paging.pageIndex + 1) === quickPaging.drawEndRange[quickPaging.drawEndRange.length-1]\"><a ng-click=\"quickPaging.searchModel.paging.toPage(quickPaging.searchModel.paging.pageIndex + 1)\">&raquo;</a></li>\r\n  </ul>\r\n</nav>\r\n\r\n<div class=\"btn-group\" ng-if=\"quickPaging.searchModel.pageCount.length > 1 && quickPaging.maxItems >= quickPaging.searchModel.pageCount.length\">\r\n  <button ng-repeat=\"x in quickPaging.searchModel.pageCount track by $index\" ng-click=\"quickPaging.searchModel.paging.toPage($index)\" ng-disabled=\"$index === quickPaging.searchModel.paging.pageIndex\" class=\"btn btn-primary btn-sm\">{{$index + 1}}</button>\r\n</div>\r\n"

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(6);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(8)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js?sourceMap!./../node_modules/sass-loader/index.js?sourceMap!./quick-grid-footer.scss", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js?sourceMap!./../node_modules/sass-loader/index.js?sourceMap!./quick-grid-footer.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(7)();
	// imports
	
	
	// module
	exports.push([module.id, "ul.pagination>li:not([disabled]) a{cursor:pointer}ul.pagination li.separator span,ul.pagination li.separator span:hover{border-top-color:transparent;border-bottom-color:transparent}ul.pagination li.separator span:hover{background-color:transparent}", "", {"version":3,"sources":["/./src/src/quick-grid-footer.scss"],"names":[],"mappings":"AAAA,mCAGY,cAAgB,CAH5B,sEASY,6BACA,+BAAiC,CAMhC,AAhBb,sCAegB,4BAA8B,CACjC","file":"quick-grid-footer.scss","sourcesContent":["ul.pagination {\r\n    > li:not([disabled]) {\r\n        a {\r\n            cursor: pointer;\r\n        }\r\n    }\r\n    \r\n    li.separator {\r\n        span {\r\n            border-top-color: transparent;\r\n            border-bottom-color: transparent;\r\n\r\n            &:hover {\r\n                border-top-color: transparent;\r\n                border-bottom-color: transparent;\r\n                background-color: transparent;\r\n            }\r\n        }\r\n    }        \r\n}"],"sourceRoot":"webpack://"}]);
	
	// exports


/***/ },
/* 7 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 9 */
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
/* 10 */
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
	            if (pageIndex < 0) {
	                return;
	            }
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
	            var _this = this;
	
	            if (this.pagingWatchHandle) {
	                this.pagingWatchHandle();
	            }
	            if (reset) {
	                this.paging.filterHash = null;
	            }
	            this.callback(this).then(function (response) {
	                if (reset) {
	                    _this.paging.pageIndex = 0;
	                }
	
	                return response;
	            }).then(this.updatePaging.bind(this)).then(this.attachPagingWatch.bind(this));
	        }
	    }, {
	        key: 'reset',
	        value: function reset() {
	            var _this2 = this;
	
	            if (this.modelWatchHandler) {
	                this.modelWatchHandler();
	            }
	
	            if (this.filterWatchHandle) {
	                this.filterWatchHandle();
	            }
	
	            Object.keys(this.filters).forEach(function (key) {
	                return _this2.filters[key].value = undefined;
	            });
	            Object.keys(this.model).forEach(function (key) {
	                return _this2.model[key] = undefined;
	            });
	
	            this.attachOtherWatchers();
	
	            this.apply(true);
	        }
	    }, {
	        key: 'toQueryString',
	        value: function toQueryString() {
	            var _this3 = this;
	
	            var segments = [];
	            var filterCount = 0;
	            Object.keys(this.filters).forEach(function (key) {
	                var value = _this3.filters[key].toJSON();
	                if (value !== undefined) {
	                    var not = _this3.filters[key].not ? '!' : '';
	                    var name = 'filters[' + filterCount++ + ']';
	                    segments.push(name + '.key=' + escape(key));
	                    segments.push(name + '.value=' + escape(not + value));
	                }
	            });
	
	            if (this.model) {
	                Object.keys(this.model).forEach(function (key) {
	                    var value = _this3.model[key];
	                    if (value !== undefined && value !== null) {
	                        if (value.toJSON) {
	                            value = value.toJSON();
	                        }
	
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
	            var _this4 = this;
	
	            var result = {
	                paging: this.paging,
	                filters: this.filters
	            };
	
	            Object.keys(this.model).forEach(function (key) {
	                result[key] = _this4.model[key];
	            });
	
	            return result;
	        }
	    }, {
	        key: 'attachOtherWatchers',
	        value: function attachOtherWatchers() {
	            var _this5 = this;
	
	            if (!this.scope) {
	                return;
	            }
	
	            this.modelWatchHandle = this.scope.$watch(function () {
	                return _this5.model;
	            }, this.onChange.bind(this), true);
	
	            this.filterWatchHandle = this.scope.$watch(function () {
	                return _this5.filters;
	            }, this.onChange.bind(this), true);
	        }
	    }, {
	        key: 'attachPagingWatch',
	        value: function attachPagingWatch() {
	            var _this6 = this;
	
	            if (!this.scope) {
	                return;
	            }
	            this.pagingWatchHandle = this.scope.$watch(function () {
	                return _this6.paging;
	            }, function (newValue, oldValue) {
	                if (newValue.sortBy !== oldValue.sortBy || newValue.pageIndex !== oldValue.pageIndex) {
	                    _this6.apply(false);
	                }
	            }, true);
	        }
	    }, {
	        key: 'updatePaging',
	        value: function updatePaging(result) {
	            if (result.pageCount !== null) {
	                this.pageCount = Array(result.pageCount);
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