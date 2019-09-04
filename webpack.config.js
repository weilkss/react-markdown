const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

const config = {
    entry: {
        app: './src/index.jsx',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'example')
    },
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, './example'),
        port: '8000',
        host: '0.0.0.0',
        historyApiFallback: true,
        hot: true
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            loader: "babel-loader",
        }, {
            test: /\.(css|less)$/,
            use: [
                { loader: 'style-loader' },
                { loader: 'css-loader' },
                { loader: 'less-loader' }
            ]
        }, {
            test: /\.(png|svg|jpg|gif|eot|woff|ttf)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            }]
        }]
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, './public/index.html'),
            filename: 'index.html',
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
};

module.exports = config;