class PrefixOperator {
    constructor(value, operator) {
        this.value = value;
        this.operator = operator;
    }

    setNot(not) {
        this.not = not;
    }

    toggleNot() {
        this.not = !this.not;
    }

    toJSON() {
        if (this.value === null || this.value === undefined || this.value === '') {
            return undefined;
        }
        var value = this.value;
        return this.operator + value;
    }
}

var operators = {
    '%': function(value) {
        this.value = value;
        this.toJSON = function() {
            if (this.value === null || this.value === undefined || this.value === '') {
                return undefined;
            }
            var value = this.value;
            return '%' + value + '%';
        };
    },
    '%~': function(value) {
        this.value = value;
        this.toJSON = function() {
            if (this.value === null || this.value === undefined || this.value === '') {
                return undefined;
            }
            var value = this.value;
            return '%' + value;
        };
    },
    '~%': function(value) {
        this.value = value;
        this.toJSON = function() {
            if (this.value === null || this.value === undefined || this.value === '') {
                return undefined;
            }
            var value = this.value;
            return value + '%';
        };
    },
    '()': function(value) {
        this.value = value;
        this.toJSON = function() {
            if (this.value === null || this.value === undefined || this.value === '') {
                return undefined;
            }

            var values = [];
            this.value.forEach(function(x) {
                values.push(x);
            });
            return '(' + values.join(',') + ')';
        };
    }
};

Object.keys(operators)
    .forEach(function(key) {
        operators[key].prototype = PrefixOperator;
    });

class PagingModel {
    constructor(defaultSortBy) {
        this.sort(defaultSortBy);
    }
    sort(by, reset) {
        if (by === null || by === undefined) {
            delete this.sortBy;
        } else {
            if (!this.sortBy || reset) {
                let index = null;
                if ((index = this.isSorting(by.toLowerCase())) !== false) {
                    if (this.sortBy[index].length === by.length) {
                        this.sortBy = [by + ' desc'];
                        return;
                    }
                    else {
                        this.sortBy = [by];
                        return;
                    }                    
                }
                else {
                    this.sortBy = [];
                }
            }

            var currentIndex = this.isSorting(by.toLowerCase());
            
            if (currentIndex !== false) {
                if (this.sortBy[currentIndex].length === by.length) {
                    this.sortBy[currentIndex] = by + ' desc';
                }
                else {
                    this.sortBy[currentIndex] = by;
                }                
            } else {
                if (this.sortBy.length < 3) {
                    this.sortBy.push(by);
                }
            }
        }
    }

    toPage(pageIndex) {
        if(pageIndex < 0){
            return;
        }
        this.pageIndex = pageIndex;
    }

    isSorting(by) {
        if (!this.sortBy)
            return false;

        var index = false;
        this.sortBy.forEach((b, i) => {
            if (b.toLowerCase().indexOf(by) > -1) {
                index = i;
            }
        });

        return index;
    }
}

class SearchModel {
    constructor(callback, defaultSortBy, defaultModel) {
        this.model = defaultModel || {};
        this.paging = new PagingModel(defaultSortBy);
        this.pageCount = [];
        this.filters = {};
        this.callback = callback;
    }

    watch(scope) {
        this.scope = scope;
        this.attachOtherWatchers();
        this.attachPagingWatch();
        return this;
    }

    addFilter(key, operator, value) {
        var Constructor = operators[operator] || PrefixOperator;
        this.filters[key] = new Constructor(value, operator);
        return this;
    }

    apply(reset) {
        if (this.pagingWatchHandle) {
            this.pagingWatchHandle();
        }
        if (reset) {            
            this.paging.filterHash = null;
        }

        return this.callback(this)
            .then((response)=> {
                if (reset) {
                    this.paging.pageIndex = 0;
                }

                return response;
            })
            .then(this.updatePaging.bind(this))
            .then(this.attachPagingWatch.bind(this));
    }
    
    reset(resetCallback) {
        if(this.modelWatchHandler) {
            this.modelWatchHandler();
        }
        
        if(this.filterWatchHandle) {
            this.filterWatchHandle();
        }
        
        Object.keys(this.filters).forEach((key) => this.filters[key].value = undefined);
        
        if(resetCallback)
            resetCallback();
        
        this.attachOtherWatchers();
       
        return this.apply(true);
    }

    toQueryString() {
        var segments = [];
        var filterCount = 0;
        Object.keys(this.filters)
            .forEach((key) => {
                var value = this.filters[key].toJSON();
                if (value !== undefined) {
                    var not = this.filters[key].not ? '!' : '';
                    var name = 'filters[' + filterCount++ + ']';
                    segments.push(name + '.key=' + escape(key));
                    segments.push(name + '.value=' + escape(not + value));
                }
            });

        if (this.model) {
            Object.keys(this.model)
                .forEach((key) => {
                    var value = this.model[key];
					if (value !== undefined && value !== null) {				
						if (value.toJSON) {
							value = value.toJSON();
						}
						
						segments.push(escape(key) + '=' + escape(value));
					}
                });
        }

        segments.push('paging.pageIndex=' + (this.paging.pageIndex || 0));

        var sortCount = 0;
        this.paging.sortBy.forEach((key) => {
            if (key !== undefined) {
                segments.push('paging.sortBy[' + sortCount++ + ']=' + escape(key));
            }
        });

        segments.push('paging.filterHash=' + escape(this.paging.filterHash || ''));

        return segments.join('&');
    }

    toJSON() {
        var result = {
            paging: this.paging,
            filters: this.filters
        };

        Object.keys(this.model)
            .forEach((key) => {
                result[key] = this.model[key];
            });

        return result;
    }

    attachOtherWatchers() {
        if(!this.scope){
            return;
        }
        
        this.modelWatchHandle = this.scope.$watch(() => {
            return this.model;
        }, this.onChange.bind(this), true);

        this.filterWatchHandle = this.scope.$watch(() => {
            return this.filters;
        }, this.onChange.bind(this), true);
    }

    attachPagingWatch() {
        if (!this.scope) {
            return;
        }
        this.pagingWatchHandle = this.scope.$watch(() => this.paging, (newValue, oldValue) => {
            if (newValue.sortBy !== oldValue.sortBy || newValue.pageIndex !== oldValue.pageIndex) {
                this.apply(false);
            }
        }, true);
    }

    updatePaging(result) {
        if (result.pageCount !== null) {
            this.pageCount = Array(result.pageCount);
        }

        this.paging.filterHash = result.filterHash;
    }

    onChange(newValue, oldValue) {
        if (newValue === oldValue) {
            return;
        }
        this.apply(true);
    }
}

export default () => SearchModel;