//var x = require('../src/quick-paging-directive.spec.js');
var testsContext = require.context("../src", false, /paging-directive\.spec\.js$/);//, true, /paging\-directive\.spec\.js$/);
testsContext.keys().forEach(testsContext);