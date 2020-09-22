const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {
        app: './src/index.js',
    },
    output: {
        path: path.resolve(__dirname, './public'),
        filename: 'index.js',
        publicPath: '/'
    },
    devServer: {
        contentBase: './public',
    }
});
