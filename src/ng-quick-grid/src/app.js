import angular from 'angular';
import quickGrid from './quick-grid-directive.js';
import quickPaging from './quick-paging-directive';
import quickSort from './quick-sort-directive';
import SearchModel from './search-model-factory';

export default angular.module('ngQuickGrid', [])
	.directive('quickGrid', quickGrid)
	.directive('quickPaging', quickPaging)
	.directive('quickSort', quickSort)
	.factory('SearchModel', SearchModel);
