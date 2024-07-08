const webpack = require('webpack');
var path = require('path');

module.exports = {
    //entry: './src/server.js',
    target: 'node',
    plugins: [
      new webpack.DefinePlugin({
        'process.env.APP_KEY': JSON.stringify('KEY'),
        // outras variáveis de ambiente...
      })
    ],
    // output: {
    //     path: path.resolve(__dirname, 'src'),
    //     publicPath: path.resolve(__dirname, '/public'),
    //     filename: 'js/app.js',
    // },
};