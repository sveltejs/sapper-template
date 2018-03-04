const path = require('path');
const config = require('sapper/webpack/config.js');
const webpack = require('webpack');

module.exports = {
	entry: config.serviceworker.entry(),
	output: config.serviceworker.output(),
	mode: process.env.NODE_ENV
};