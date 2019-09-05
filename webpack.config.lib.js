const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack');
const version = require("./package.json").version;
const banner =
	"/**\n" +
	" * xwb-react-markdown v" + version + "\n" +
	" * https://github.com/xwb007/xwb-react-markdown.git\n" +
	" * MIT License\n" +
	" */\n";
const config = {
	entry: {
		markdown: './src/Markdown/markdown.jsx',
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'lib'),
		libraryTarget: "umd"
	},
	externals: [
		{ react: 'react', },
		{ ['react-dom']: 'react-dom', },
		{ ['axios']: "axios" },
		{ ['markdown-it']: "markdown-it" },
		{ ['markdown-it-emoji']: "markdown-it-emoji" },
		{ ['markdown-it-sub']: "markdown-it-sub" },
		{ ['markdown-it-sup']: "markdown-it-sup" },
		{ ['markdown-it-footnote']: "markdown-it-footnote" },
		{ ['markdown-it-deflist']: "markdown-it-deflist" },
		{ ['markdown-it-abbr']: "markdown-it-abbr" },
		{ ['markdown-it-ins']: "markdown-it-ins" },
		{ ['markdown-it-mark']: "markdown-it-mark" },
		{ ['markdown-it-task-lists']: "markdown-it-task-lists" },
		{ ['highlight.js']: "highlight.js" }
	],
	mode: 'production',
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
		new CleanWebpackPlugin(['lib']),
		new webpack.BannerPlugin({
			banner,
			raw: false
		}),
		new CopyWebpackPlugin([{
			from: 'src/Markdown/markdown.ts'
		}])
	],
};

module.exports = config;