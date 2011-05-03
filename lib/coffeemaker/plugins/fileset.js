var fileset = function() {
	var fs = require('fs'), path = require('path'), util = require('util');
	return ( {
		name : function(abspath) {
			return path.basename(abspath, path.extname(abspath));
		},

		list : function(start, callback, filter, sync) {
			// sync or not.
		if (sync) {
			var stat = fs.lstatSync(start);
			if (stat.isDirectory()) {
				var files = fs.readdirSync(start);
				if (files) {
					var count = files.length;
					for ( var x = 0; x < count; x++) {
						var abspath = path.join(start, files[x]);
						fileset.list(abspath, callback, filter, sync);
					}
				}
				// a file?
	} else {
		if (filter !== undefined) {
			if (filter(start)) {
				return callback(null, start);
			}
		} else {
			return callback(null, start);
		}
	}
} else {
	fs.lstat(start, function(err, stat) {
		if (err) {
			return callback(err);
		}
		if (stat.isDirectory()) {
			fs.readdir(start, function(err, files) {
				if (err) {
					return callback(err);
				} else if (files) {
					var count = files.length;
					for ( var x = 0; x < count; x++) {
						var abspath = path.join(start, files[x]);
						fileset.list(abspath, callback, filter);
					}
				}
			});
			// a file?
		} else {
			if (filter !== undefined) {
				if (filter(start)) {
					return callback(null, start);
				}
			} else {
				return callback(null, start);
			}
		}
	});
}
},
listSync : function(start, filter) {

var files = [];

var callback = function(err, file) {
	if (file) {
		files.push(file);
	}
	return files;
};

fileset.list(start, callback, filter, true);

return files;
}
	});
}();

exports.name = fileset.name;

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

exports.list = fileset.list;
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
exports.listSync = fileset.listSync;