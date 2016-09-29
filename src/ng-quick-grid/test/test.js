//var x = require('../src/quick-paging-directive.spec.js');
var testsContext = require.context("../src", false, /\.spec\.js$/);//, true, /paging\-directive\.spec\.js$/);
testsContext.keys().forEach(testsContext);