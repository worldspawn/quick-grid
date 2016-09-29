/// <binding ProjectOpened='Watch - Development' />
var webpack = require('webpack');
//var path = require('path');
var WebpackNotifierPlugin = require('webpack-notifier');
var path = require('path');

module.exports = {
    entry: {
        // Add your new pages here
        'demo': './app/app.js'
    },
    output: {
        path: path.resolve(__dirname, "app"),
        publicPath: "/assets/",
        filename: "[name].js"
      },
    devServer: {
        contentBase: ".",
        host: "localhost",
        port: 9000,
        inline: true,
        publicPath: '/' 
    },
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
            }
        ]
    },
    externals: {
        //'angular': 'angular'
    },
    plugins: [
        new WebpackNotifierPlugin()
    ]
}