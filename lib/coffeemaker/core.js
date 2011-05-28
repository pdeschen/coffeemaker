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
var color = require("ansi-color").set;

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
  template : require('./plugins/template.js'),
  i18n : require('./plugins/i18n.js')
}

/**
 * @private
 */
var build = function (options) {

  info(color(name + " v" + version, "blue+bold"));

  targets = options.targets.split(',');
  buildSpecPath = cwd + options.file;

  var buildspec = require(buildSpecPath);

  info(color("Using " + buildSpecPath + " build spec.", "blue+bold"));

  for ( var int = 0; int < targets.length; int++) {
    var target = targets[int];
    execute(buildspec, target);
  }
};

/**
 * @private
 */
var execute = function (buildspec, target) {

  stack.push(target);
  var message = color("(" + target + ") ", "white");
  info(message);

  if (buildspec[target].depends) {
    for ( var int = 0; int < buildspec[target].depends.length; int++) {
      var message = color("(" + target + "." + buildspec[target].depends[int] + ") ", "white");
      info(message);
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
var info = function (message, tag) {
  if (tag) {
    message = color(tag + " ", "green+bold") + message;
  }
  console.log(message);
};

var error = function (message, tag) {
  if (!tag) {
    tag = "(error) ";
  }
  console.log(color(tag, "red+bold"), message);
};
var warning = function (message, tag) {
  console.log(color(tag, "yellow+bold"), message);
};

exports.build = build;
exports.print = info;
exports.error = error;
exports.warning = warning;
exports.info = info;
exports.name = name;
exports.version = version;
exports.plugins = plugins;
