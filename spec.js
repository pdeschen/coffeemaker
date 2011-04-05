var mustache = require('mustache');
var sys = require('sys');
var fs = require('fs');
var util = require('util');

var resources = {
	js: "/lib/coffeemaker/coffeemaker.js"
};

exports.all = {
	depends : [ 'doc' ]
};

exports.doc = {
	task : function($cm) {
		$cm.doc($cm.cwd + resources.js);
	}
};