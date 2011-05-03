var $cm = require('../core.js'), mustache = require('mustache'), path = require('path'), fs = require('fs'), util = require('util');

var partials = {};
var TEMPLATE_EXTENSION = ".mustache";

var mustache_file_filter = function(file) {
	return /(.*).mustache/.test(file);
}

var html = function(view, model, callback, partials) {

	var html = mustache.to_html(view, model, partials);

	callback.call(this, {
		html : html
	});
}

var render = function(templatePath, model, callback) {

	var fileset = $cm.plugins.fileset;
	var dir = templatePath;
	if (!fs.lstatSync(templatePath).isDirectory()) {
		dir = path.dirname(templatePath);
	}
	cache_partials(dir);

	fileset.list(templatePath, function(err, file) {
		var view = partials[fileset.name(file)];
		if (view) {
			var html = mustache.to_html(view, model, partials);

			callback.call(this, {
				html : html,
				template : file
			});
		}

	}, mustache_file_filter);

}

var renderTo = function(templatePath, model, to) {

	templatePath = path.normalize(templatePath);
	to = path.normalize(to + "/");
	
	$cm.print("\t[render] " + templatePath + " => " + to);

	var from = templatePath;
	var fileset = $cm.plugins.fileset;

	if (!fs.lstatSync(templatePath).isDirectory()) {
		from = path.dirname(templatePath);
	}

	render(templatePath, model, function(data) {

		var file = data.template.replace(from, to);
		file = file.replace(TEMPLATE_EXTENSION, ".html");
		$cm.print("\t\t[mustache] " + data.template + " => " + file);
		var dir = path.dirname(file);
		fileset.mkdirs(dir);
		fs.writeFile(file, data.html, function(err) {
			if (err) {
				throw err;
			}
		});
	});
}

var cache_partials = function(dir) {

	var fileset = $cm.plugins.fileset;

	var list = fileset.listSync(dir, mustache_file_filter);

	// load the partials and cache
	for ( var index = 0; index < list.length; index++) {

		var file = list[index];
		var stat = fs.lstatSync(file);
		if (stat.isDirectory()) {
			continue;
		}
		if (!partials[fileset.name(file)]) {

			var view = fs.readFileSync(file, 'utf-8');

			partials[fileset.name(file)] = view;
		}
	}
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
exports.renderTo = renderTo;