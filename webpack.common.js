module.exports = {
    module: {
        rules: [
            {
                test: /\.js|\.es6|\.jsx$/,
                parser: {
                    // remove AMD parsing because wrong pathways
                    amd: false,
                    requireJs: false,
                },
            },
            {test: /\.js$|\.es6$|\.jsx$/, exclude: /node_modules/, loader: 'babel-loader'},
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            }
        ]
    },
    // need for webpack to resolve right pathways
    resolve: {
        extensions: ['.js', '.json', '.jsx', '.es6'],
    },
};
