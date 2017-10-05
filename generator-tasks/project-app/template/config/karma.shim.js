// See https://github.com/preboot/angular-webpack/blob/51c72e481eecdaa461b8c3a1f021d2f2064e4b80/karma-shim.js#L1
Error.stackTraceLimit = Infinity;

require('core-js/client/shim');
require('reflect-metadata');

require('zone.js/dist/zone');
require('zone.js/dist/long-stack-trace-zone');
require('zone.js/dist/proxy');
require('zone.js/dist/sync-test');
require('zone.js/dist/jasmine-patch');
require('zone.js/dist/async-test');
require('zone.js/dist/fake-async-test');

/*
We can use the the context method on require that webpack created in order to
tell webpack what files we actually want to require or import. Below, context
will be a function/object with file names as keys. Using a regex we are saying
find files that end with '.spec.ts' and get its path. By passing in true
we say do this recursively
*/
// https://angular-2-training-book.rangle.io/handout/testing/intro-to-tdd/setup/karma-config.html
// https://github.com/webpack-contrib/karma-webpack
var testContext = require.context('../packages', true, /spec\.ts/);

// get all the files, for each file, call the context function
// that will require the file and load it up here. Context will
// loop and require those spec files here
testContext.keys().forEach(testContext);

// Select BrowserDomAdapter smewhere in the test setup
// see https://github.com/AngularClass/angular2-webpack-starter/issues/124
var testing = require('@angular/core/testing');
var browser = require('@angular/platform-browser-dynamic/testing');

testing.TestBed.initTestEnvironment(browser.BrowserDynamicTestingModule, browser.platformBrowserDynamicTesting());
