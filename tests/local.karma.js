/*!
 * A MongoDB inspired ES6 Map() query language. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under MIT license https://raw.githubusercontent.com/LouisT/MapQL/master/LICENSE
 *
 * Usage: karma start browser-test.js
 */
'use strict';
module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['browserify', 'mocha'],
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
        browsers: ['PhantomJS']
    });
};

