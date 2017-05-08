var webpack = require('webpack')

module.exports = {
    entry: './app/main.ts',
    output: {
        path: __dirname+"/dist",
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: 'style-loader!css-loader'}
        ]
    }
}