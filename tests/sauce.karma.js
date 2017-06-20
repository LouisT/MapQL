/*!
 * A MongoDB inspired ES6 Map() query language. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under MIT license https://raw.githubusercontent.com/LouisT/MapQL/master/LICENSE
 *
 * Usage: karma start tests/sauce.karma.js
 */
'use strict';
const SauceBrowsers = {},
      pkg = require('../package'),
      build = `build-${pkg.version}`,
      Win10 = {
          base: 'SauceLabs',
          platform: 'Windows 10'
      },
      Win7 = {
          base: 'SauceLabs',
          platform: 'Windows 7'
      },
      OSX102 = {
          base: 'SauceLabs',
          platform: 'macOS 10.12'
      },
      Linux = {
          base: 'SauceLabs',
          platform: 'Linux'
      },
      hasbeta = {
          chrome: true,
          firefox: false
      };

/*
 * Generate Windows 10 browser settings.
 */
[
    {
        browserName: 'firefox',
        version: 53
    },
    {
        browserName: 'chrome',
        version: 59
    }
].forEach((browser) => {
    if (hasbeta[browser.browserName]) {
       SauceBrowsers[`win10_${browser.browserName}_beta`] = Object.assign({}, Win10, browser, { version: 'beta' });
    }
    let versions = (browser._versions ? browser._versions : 3);
    for (let num = 1; num <= versions; num++) {
        let version = browser.version--;
        SauceBrowsers[`win10_${browser.browserName}_${version}`] = Object.assign({}, Win10, browser, { version: version });
    }
});
SauceBrowsers['win10_edge_13'] = Object.assign({}, Win10, {
    browserName: 'MicrosoftEdge',
    version: '13.10586'
});
SauceBrowsers['win10_edge_14'] = Object.assign({}, Win10, {
    browserName: 'MicrosoftEdge',
    version: '14.14393'
});
SauceBrowsers['win10_edge_15'] = Object.assign({}, Win10, {
    browserName: 'MicrosoftEdge',
    version: '15.15063'
});
SauceBrowsers['win10_ie_11'] = Object.assign({}, Win10, {
    browserName: 'internet explorer',
    version: '11.103'
});

/*
 * Generate Windows 7 browser settings.
 */
[
    {
        browserName: 'firefox',
        version: 53
    },
    {
        browserName: 'chrome',
        version: 59
    },
    {
        browserName: 'internet explorer',
        version: 11,
        _versions: 4
    }
].forEach((browser) => {
    if (hasbeta[browser.browserName]) {
       SauceBrowsers[`win7_${browser.browserName}_beta`] = Object.assign({}, Win7, browser, { version: 'beta' });
    }
    let versions = (browser._versions ? browser._versions : 3);
    for (let num = 1; num <= versions; num++) {
        let version = browser.version--;
        SauceBrowsers[`win7_${browser.browserName}_${version}`] = Object.assign({}, Win7, browser, { version: version });
    }
});
SauceBrowsers['win7_opera_12'] = Object.assign({}, Win7, {
    browserName: 'opera',
    version: '12.12'
});
SauceBrowsers['win7_opera_11'] = Object.assign({}, Win7, {
    browserName: 'opera',
    version: '11.64'
});
SauceBrowsers['win7_safari_5'] = Object.assign({}, Win7, {
    browserName: 'safari',
    version: '5.1'
});

/*
 * Generate OSX 10.2 browser settings.
 */
[
    {
        browserName: 'firefox',
        version: 53
    },
    {
        browserName: 'chrome',
        version: 59
    }
].forEach((browser) => {
    if (hasbeta[browser.browserName]) {
       SauceBrowsers[`osx102_${browser.browserName}_beta`] = Object.assign({}, OSX102, browser, { version: 'beta' });
    }
    let versions = (browser._versions ? browser._versions : 3);
    for (let num = 1; num <= versions; num++) {
        let version = browser.version--;
        SauceBrowsers[`osx102_${browser.browserName}_${version}`] = Object.assign({}, OSX102, browser, { version: version });
    }
});
SauceBrowsers['osx102_safari_10'] = Object.assign({}, OSX102, {
    browserName: 'safari',
    version: '10.0'
});

/*
 * Generate Linux browser settings.
 */
[
    {
        browserName: 'firefox',
        version: 45
    },
    {
        browserName: 'chrome',
        version: 48
    }
].forEach((browser) => {
    let versions = (browser._versions ? browser._versions : 3);
    for (let num = 1; num <= versions; num++) {
        let version = browser.version--;
        SauceBrowsers[`osx102_${browser.browserName}_${version}`] = Object.assign({}, Linux, browser, { version: version });
    }
});
SauceBrowsers['linux_opera_12'] = Object.assign({}, Linux, {
    browserName: 'opera',
    version: '12.15'
});

/*
 * Karma config, browserify -> babelify -> Sauce Labs
 */
module.exports = function(config) {
    console.log('Build: %s', build);
    if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
       console.log('Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.')
       process.exit(1)
    }
    config.set({
        basePath: '',
        frameworks: ['browserify', 'mocha'],
        plugins: ['karma-browserify', 'karma-sauce-launcher', 'karma-mocha'],
        files: [
            './browser.js'
        ],
        exclude: [
        ],
        preprocessors: {
            './browser.js': ['browserify']
        },
        browserify: {
            debug: true,
            transform: [[ 'babelify', {
                presets: ['es2015'],
                plugins: [
                    ["babel-plugin-transform-builtin-extend", {
                        globals: ["Array", "Map"]
                    }],
                    ["transform-runtime", {
                        polyfill: false,
                        regenerator: true
                    }]
                ]
            }]]
        },
        sauceLabs: {
            testName: 'MapQL',
            build: build,
            tags: ['browserify', 'babelify', 'es5', 'transpile']
        },
        customLaunchers: SauceBrowsers,
        browsers: Object.keys(SauceBrowsers),
        reporters: ['saucelabs'],
        singleRun: true
    });
};
