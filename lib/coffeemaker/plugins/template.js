var $cm = require('../core.js'), mustache = require('mustache'), path = require('path'), fs = require('fs'), util = require('util');

var _partials = {};
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
	templatePath = fileset.expend(templatePath);

	var fileset = $cm.plugins.fileset;
	var dir = templatePath;
	if (!fs.lstatSync(templatePath).isDirectory()) {
		dir = path.dirname(templatePath);
	}
	cache_partials(dir);

	fileset.list(templatePath, function(err, file) {
		var stat = fs.lstatSync(file);
		if (stat.isFile()) {
			var key = cache_key(templatePath, file);
			var view = _partials[key];
			if (view) {
				var html = mustache.to_html(view, model, _partials);
				callback.call(this, {
					html : html,
					template : file
				});
			}
		}
	}, mustache_file_filter);

}

var renderTo = function(templatePath, model, to) {

	var fileset = $cm.plugins.fileset;

	templatePath = fileset.expend(templatePath);
	to = fileset.expend(to);

	$cm.info(templatePath + " => " + to, "\t[render]");

	var from = templatePath;

	if (!fs.lstatSync(templatePath).isDirectory()) {
		from = path.dirname(templatePath);
	}

	render(templatePath, model, function(data) {
		var file = data.template.replace(from, to + "/");
		file = file.replace(TEMPLATE_EXTENSION, ".html");
		$cm.info(data.template + " => " + file, "\t\t[mustache]");
		var dir = path.dirname(file);
		fileset.mkdirs(dir);
		fs.writeFileSync(file, data.html, 'utf-8');
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
		var key = cache_key(dir, file);
		if (!_partials[key]) {
			$cm.info(key + " => " + file, "\t\t[caching]");
			var view = fs.readFileSync(file, 'utf-8');
			_partials[key] = view;
		}
	}
}

var cache_key = function(basedir, file) {
	var key = file.replace(basedir, '');
	key = key.replace(/\.mustache$/, '');
	key = key.replace(/^\//, '');
	return key;
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