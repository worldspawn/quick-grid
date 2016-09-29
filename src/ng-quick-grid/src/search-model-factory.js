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
    sort(by) {
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

    toPage(pageIndex) {
        this.pageIndex = pageIndex;
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
            this.paging.pageIndex = 0;
            this.paging.filterHash = null;
        }
        this.callback(this)
            .then(this.updatePaging.bind(this))
            .then(this.attachPagingWatch.bind(this));
    }

    toQueryString() {
        //note model is not output in the query string, i'd have to build a deep converter and i can't be arsed. just use filters! :P
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
                    if (value.toJSON) {
                        value = value.toJSON();
                    }
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
            this.pageCount.length = result.pageCount;
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