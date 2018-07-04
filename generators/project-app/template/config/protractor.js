let path = require('path');

// An example configuration file
exports.config = {
  // The address of a running selenium server.
  //seleniumAddress: 'http://localhost:4444/wd/hub',
  seleniumArgs: [],
  jvmArgs: [],
  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    browserName: 'chrome'
  },

  // Spec patterns are relative to the configuration file location passed
  // to protractor (in this example conf.js).
  // They may include glob patterns.
  specs: [
      '../src/**/*-e2e.{ts,js}',
      '../packages/**/*-e2e.{ts,js}'
  ],

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true, // Use colors in the command line report.
    defaultTimeoutInterval: 15000
  },

  beforeLaunch: function() {
    require('ts-node').register({
      project: path.resolve(__dirname, '../tsconfig.json'),
      compiler: 'typescript',
      transpileOnly: true,
      compilerOptions: {
        module: "commonjs"
      }
    });
  }
};

