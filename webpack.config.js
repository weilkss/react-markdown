const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

const config = {
	entry: {
		markdown: './src/index.jsx',
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'example')
	},
	mode: 'development',
	devtool: 'inline-source-map',
	devServer: {
		contentBase: path.join(__dirname, './example'),
		port: '8080',
		host: '0.0.0.0',
		historyApiFallback: true,
		hot: true
	},
	module: {
		rules: [{
			test: /\.(js|jsx)$/,
			loader: "babel-loader",
		},
		{
			test: /\.css$/,
			use: [
				'style-loader',
				'css-loader',
				'postcss-loader'
			]
		},
		{
			test: /\.less$/,
			use: [
				'style-loader',
				{
					loader: 'css-loader',
					options: {
						importLoaders: 1
					}
				},
				'postcss-loader',
				'less-loader'
			]
		},
		{
			test: /\.(png|svg|jpg|gif|eot|woff|ttf)$/,
			use: [{
				loader: 'url-loader',
				options: {
					limit: 50000
				}
			}]
		}
		]
	},
	resolve: {
		extensions: ['.js', '.jsx'],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, './public/index.html'),
			filename: 'index.html',
		}),
		new CleanWebpackPlugin(['example']),
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin()
	],
};

module.exports = config;