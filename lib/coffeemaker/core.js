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
  i18n : require('./plugins/i18n.js'),
  release : require('./plugins/release.js')
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

var inherit = function (source, destination) {

  if (typeof (source) == "object") {
    for ( var prop in source) {
      if ((typeof (source[prop]) == "object") && (source[prop] instanceof Array)) {
        console.log('array');
        if (destination[prop] === undefined) {
          destination[prop] = [];
        }
        for ( var index = 0; index < source[prop].length; index += 1) {
          if (typeof (source[prop][index]) == "object") {
            if (destination[prop][index] === undefined) {
              destination[prop][index] = {};
            }
            destination[prop].push(inherit(source[prop][index], destination[prop][index]));
          } else {
            destination[prop].push(source[prop][index]);
          }
        }
      } else if (typeof (source[prop]) == "object") {
        if (destination[prop] === undefined) {
          destination[prop] = {};
        }
        inherit(source[prop], destination[prop]);
      } else {
        destination[prop] = source[prop];
      }
    }
  }

  return destination;
};

exports.build = build;
exports.print = info;
exports.error = error;
exports.warning = warning;
exports.info = info;
exports.inherit = inherit;
exports.cwd = cwd;
exports.name = name;
exports.version = version;
exports.plugins = plugins;
