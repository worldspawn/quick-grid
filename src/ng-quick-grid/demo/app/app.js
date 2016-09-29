import angular from 'angular';
import './ng-quick-grid.min.js';

angular.module('app', ['ngQuickGrid'])
.run(()=> {
	console.log('apsp running');
});

console.log('xx');