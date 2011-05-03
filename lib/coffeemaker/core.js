/**!
 * CoffeeMaker
 * Copyright(c) 2011 Pascal Deschenes <pdeschen@rassemblr.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */
var util = require('util'), fs = require('fs'), http = require("http"), url = require("url");
var mime = require('mime');

/**
 * @private
 */
version = "0.0.1";
name = "CoffeeMaker";
cwd = process.cwd() + "/";
buildSpecPath = cwd + "spec.js";
defaultTargetName = "all";
targets = [ defaultTargetName ];
stack = [];
plugins = {
	serve : require('./plugins/serve.js'),
	fileset : require('./plugins/fileset.js'),
	template : require('./plugins/template.js')
}

/**
 * @private
 */
var build = function(options) {

	print(name + " v" + version);

	targets = options.targets.split(',');
	buildSpecPath = cwd + options.file;

	var buildspec = require(buildSpecPath);

	print("Using " + buildSpecPath + " build spec.");

	for ( var int = 0; int < targets.length; int++) {
		var target = targets[int];
		execute(buildspec, target);
	}
};

/**
 * @private
 */
var execute = function(buildspec, target) {

	stack.push(target);
	print("(" + target + ") ");

	if (buildspec[target].depends) {
		for ( var int = 0; int < buildspec[target].depends.length; int++) {
			print("(" + target + "." + buildspec[target].depends[int] + ") ");
			execute(buildspec, buildspec[target].depends[int]);
		}
	}
	if (buildspec[target].task) {
		buildspec[target].task.call(this);
	}

};

/**
 * Print message to standard out console.
 * 
 * Examples:
 * 
 * print('hello world');
 * 
 * @param {String}
 *            message
 */
var print = function(message) {
	console.log(message);
};

/**
 * Make
 */
exports.build = build;
exports.print = print;
exports.name = name;
exports.version = version;
exports.plugins = plugins;
