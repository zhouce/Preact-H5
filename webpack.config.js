const merge = require('webpack-merge');

const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const commonConfig = require('./webpack.common.config.js');

const publicConfig = {
    devtool: 'cheap-module-source-map',
    module: {
        rules: [{
            test: /\.(css|scss)$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: [{
					loader: 'css-loader',
					options: {
						modules: true,
						localIdentName: '[local]-[hash:base64:5]',
						importLoaders: 2
					}
				}, "postcss-loader", "sass-loader"]
            })
        }]
    },
    plugins: [
		new webpack.HashedModuleIdsPlugin(),
        new CleanWebpackPlugin(['dist/*.*']),
        new UglifyJSPlugin({
			parallel: true,
			uglifyOptions: {
				compress: {
					drop_console: true
				},
				output: {
					comments: false,
					beautify: false
				}
            }
		}),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new ExtractTextPlugin({
            filename: '[name].[contenthash:5].css',
			/**
			 * 会把其他模块的css都打包进入口js中引进的主css中，增加主css大小 去掉后 其他模块的css打包进自己的chunk.js
			 * 运行时 各自的chunk.js会动态在<head>中插入<style>
			 */
            // allChunks: tru
        })
    ]

};

module.exports = merge(commonConfig, publicConfig);