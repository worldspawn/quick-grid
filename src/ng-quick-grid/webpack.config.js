/// <binding ProjectOpened='Watch - Development' />
var webpack = require('webpack');
//var path = require('path');
var WebpackNotifierPlugin = require('webpack-notifier');

module.exports = {
    entry: {
        // Add your new pages here
        'ng-quick-grid': './src/app.js',
        'ng-quick-grid.min': './src/app.js'
    },
    output: {
        path: __dirname,
        filename: '[name].js',
        chunkFilename: '[id].[name].js'
    },
    devServer: {
        contentBase: ".",
        host: "localhost",
        port: 9000
    },
    devtool: 'source-map',
    module: {
        loaders: [
        {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel', // 'babel-loader' is also a legal name to reference
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.html$/,
                loader: 'raw'
            },
            {
                test: /\.scss$/,
                loaders: ["style","css?sourceMap","sass?sourceMap"]
            }
        ]
    },
    externals: {
        'angular': 'angular'
    },
    plugins: [
        new WebpackNotifierPlugin(),
        new webpack.optimize.UglifyJsPlugin({
          include: /\.min\.js$/,
          minimize: true
        })
    ]
}