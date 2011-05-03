/*!
 * CoffeeMaker
 * Copyright (c) 2011 Pascal Deschenes <pdeschen@rassemblr.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */
var sys = require('sys'), fs = require('fs'), path = require('path'), util = require('util');
var $cm = require('./core.js');


/**
 * Parse the command line arguments.
 * 
 * @api public
 */
exports.parse = function() {
	var cli = require('cli');
	cli.enable('version');

	cli.setApp($cm.name, $cmversion);

	var options = cli.parse( {
		file : [ 'f', 'Spec file', 'path', './spec.js' ],
		targets : [ false, 'Target in comma seperated list', 'string', 'all' ]
	});

	$cm.build(options);	
};
