import angular from 'angular';
import './ng-quick-grid.js';

angular.module('app', ['ngQuickGrid'])
.run(()=> {
	console.log('apsp running');
});

console.log('xx');