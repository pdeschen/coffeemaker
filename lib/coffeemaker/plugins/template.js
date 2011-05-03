var $cf = require('../core.js'), mustache = require('mustache'), path = require('path'), fs=require('fs'), util=require('util');

var partials = {};

var mustache_file_filter = function(file)
{
	return /(.*).mustache/.test(file);
}

var html = function(view, model, callback) {

	var html = mustache.to_html(view, model);

	callback.call(this, html);
}

var render = function(template, model, callback) {

	var dir = path.dirname(template);
	var fileset = $cf.plugins.fileset;
	var list = fileset.listSync(dir, mustache_file_filter);
	// load the partials and cache
	for ( var index = 0; index < list.length; index++) {
		var file = list[index];

		if (!partials[fileset.name(file)]) {
			
			var view = fs.readFileSync(file, 'utf-8');
			
			partials[fileset.name(file)] = view; 
		}
	}

	//console.log(util.inspect(partials, true, null));
	// get the view from the partials
	var view = partials[fileset.name(template)];
	var html = mustache.to_html(view, model, partials);

	callback.call(this, html);
}

/**
 * Renders model into mustache view then apply callback with resulting html.
 * 
 * Examples:
 * 
 * @param {String}
 */
exports.html = html;
exports.render = render;