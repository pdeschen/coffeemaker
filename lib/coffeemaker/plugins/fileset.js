var $cm = require('../core.js'), fs = require('fs'), path = require('path'), util = require('util');

var name = function(location) {
	return path.basename(location, path.extname(location));
};

var expend = function(location) {
	if (location.indexOf('./') === 0 || location === '.') {
		// remove leading ./
		location.replace(/^.\/.*$/, '');
		location = path.join(process.cwd(), location);
	}
	return path.normalize(location);
}

var list = function(location, callback, filter, sync) {
	// sync or not.
	if (sync) {
		var stat = fs.lstatSync(location);
		if (stat.isDirectory()) {
			var files = fs.readdirSync(location);
			if (files) {
				var count = files.length;
				for ( var x = 0; x < count; x++) {
					var abspath = path.join(location, files[x]);
					list(abspath, callback, filter, sync);
				}
				return callback(null, location);
			}
			// a file?
		} else if (filter === undefined || filter(location)) {
			return callback(null, location);
		}
	} else {
		fs.lstat(location, function(err, stat) {
			if (err) {
				return callback(err);
			}
			if (stat.isDirectory()) {
				fs.readdir(location, function(err, files) {
					if (err) {
						return callback(err);
					} else if (files) {
						var count = files.length;
						for ( var x = 0; x < count; x++) {
							var abspath = path.join(location, files[x]);
							list(abspath, callback, filter);
						}
						return callback(null, location);
					}
				});
				// a file?
			} else if (filter === undefined || filter(location)) {
				return callback(null, location);
			}
		});
	}
};

var listSync = function(location, filter) {

	var files = [];

	var callback = function(err, file) {
		if (file) {
			files.push(file);
		}
		return files;
	};

	list(location, callback, filter, true);

	return files;
};

var del = function(location) {

	location = path.normalize(location);
	$cm.print("\t[del] " + location);
	path.exists(location, function(exits) {
		if (!exits) {
			return;
		}
		try {
			var stats = fs.statSync(location);

			if (stats && stats.isFile()) {
				fs.unlinkSync(location, function(err) {
					if (err) {
						throw err;
					}
				});
			} else if (stats && stats.isDirectory()) {
				var ls = fs.readdirSync(location);
				for ( var int = 0; int < ls.length; int++) {
					var segment = ls[int];
					del(path.join(location, segment));
				}
				fs.rmdirSync(location);
			}
		} catch (e) {
		}
	});
};

var copy = function(fromLocation, toLocation, exclude) {
	fromLocation = path.normalize(fromLocation);
	toLocation = path.normalize(toLocation);

	if (exclude && exclude instanceof RegExp && exclude.test(fromLocation)) {
		return;
	}
	$cm.print("\t[copy] " + fromLocation + " => " + toLocation);

	var stats = fs.statSync(fromLocation);
	if (stats && stats.isFile()) {
		var is = fs.createReadStream(fromLocation);
		var os = fs.createWriteStream(toLocation);
		util.pump(is, os);
	} else if (stats && stats.isDirectory()) {
		mkdirs(toLocation);
		try {
			var ls = fs.readdirSync(fromLocation);
			for ( var int = 0; int < ls.length; int++) {
				var segment = ls[int];
				copy(path.join(fromLocation, segment), path.join(toLocation,
						segment), exclude);
			}
		} catch (e) {
			// $cm.print("[error]" + e);
		}
	}
};

var mkdirs = function(location) {

	var segments = location.split("/");
	var dir = "/";

	for ( var int = 1; int < segments.length; int++) {
		var segment = segments[int];
		dir = path.join(dir, segment);
		try {
			fs.mkdirSync(dir, '777');
			$cm.print("\t[mkdirs] " + dir);
		} catch (e) {
			// $cm.print("[error] " + e);
		}
	}
};
exports.mkdirs = mkdirs;
/**
 * Deep copy from given path to other path, excluding files matching given
 * regexp pattern.
 * 
 * Examples: // copy all files from foo to bar, // except files ending with .txt
 * copy('/tmp/foo', '/tmp/bar', /(.*)\.txt/);
 * 
 * @param fromPath
 * @param toPath
 * @param exclude
 */
exports.copy = copy;
exports.del = del;
exports.expend = expend;
exports.name = name;

/**
 * Asynchronously list a directory path (recursively deep)
 * 
 * Examples:
 * 
 * var callback = function(err, file) { if (file) { console.log(file); } };
 * fileset.list('../', callback);
 * 
 * @param {String}
 *            path
 * @param {Function}
 *            callback function to be called for each and every files.
 * @param {Function}
 *            filter function returning true or false on path match
 * @param {Boolean}
 *            a flag to roll either the async or sync technique.
 */

exports.list = list;
/**
 * Synchronously list a directory path (recursively deep)
 * 
 * Examples:
 * 
 * console.log(fileset.listSync('../'));
 * 
 * @param {String}
 *            path
 * @param {Function}
 *            filter function returning true or false on path match
 * 
 */
exports.listSync = listSync;