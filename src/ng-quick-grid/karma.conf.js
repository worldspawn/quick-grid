var webpack = require('webpack');
// Karma configuration
// Generated on Sat Jan 17 2015 02:07:43 GMT+1100 (AUS Eastern Daylight Time)

module.exports = function(config) {
    'use strict';

    config.set({

        files: [
            'test/test.js'
        ],

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],



        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],//, 'coverage'],

        preprocessors: {
            'test/test.js': ['webpack']
        },


        // coverageReporter: {            
        //     dir: 'build/coverage/',
        //     reports: [
        //         //{ type: 'html', subdir: 'html' },
        //         //{ type: 'text-summary' },
        //     ]

        // },

        webpack: {
            // webpack configuration
            module: {
                loaders: [{
                    test: /\.jsx?$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel', // 'babel-loader' is also a legal name to reference
                    query: {
                        presets: ['es2015']
                    }
                }, {
                    test: /\.html$/,
                    loader: 'raw'
                }],
                // postLoaders: [{
                //     test: /\.js/,
                //     exclude: /(test|node_modules|bower_components)/,
                //     loader: 'istanbul-instrumenter'
                // }]
            },
            resolve: {
                modulesDirectories: [
                    "",
                    "src",
                    "node_modules"
                ]
            }
        },

        webpackMiddleware: {
            // webpack-dev-middleware configuration
            noInfo: true
        },



        plugins: [
            require("karma-webpack"),
            //require("istanbul-instrumenter-loader"),
            require("karma-jasmine"),
            //require("karma-coverage"),
            require("karma-phantomjs-launcher"),
            require("karma-spec-reporter")
        ],

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_ERROR,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
            // available browser launcher
    });
};