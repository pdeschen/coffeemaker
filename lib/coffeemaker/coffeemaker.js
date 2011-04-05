/**!
 * CoffeeMaker
 * Copyright(c) 2011 Pascal Deschenes <pdeschen@rassemblr.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */
var util = require('util');
var fs = require('fs');
var dox = require('dox');
var libpath = require('path'), http = require("http"), url = require("url"), mime = require('mime');

/**
 * Make
 */
exports.build = function() {
	var $cm = new CoffeeMaker();

	$cm.build();
};

/**
 * @private
 */
CoffeeMaker.prototype.build = function() {
	this.print("CoffeeMaker version " + this.version);

	if (process.argv[2] == '-f') {
		if (process.argv[3]) {
			this.buildSpecPath = this.cwd + process.argv[3];
		} else {
			this.print("Missing build spec.");
			process.exit();
		}
	} else if (process.argv[2]) {
		this.targets = eval(process.argv[2]);
	}
	var buildspec = require(this.buildSpecPath);

	this.print("Using " + this.buildSpecPath + " build spec.");

	for ( var int = 0; int < this.targets.length; int++) {
		var target = this.targets[int];
		this.execute(buildspec, target);
	}
};

/**
 * @private
 */
CoffeeMaker.prototype.execute = function(buildspec, target) {

	this.stack.push(target);
	this.print("(" + target + ") ");

	if (buildspec[target].depends) {
		for ( var int = 0; int < buildspec[target].depends.length; int++) {
			this.print("(" + target + "." + buildspec[target].depends[int]
					+ ") ");
			this.execute(buildspec, buildspec[target].depends[int]);
		}
	}
	if (buildspec[target].task) {
		buildspec[target].task.call(this, this);
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
CoffeeMaker.prototype.print = function(message) {
	// util.log(message);
	console.log(message);
};

/**
 * Recursive delete starting from given path.
 * 
 * @param path
 */
CoffeeMaker.prototype.del = function(path) {
	path = libpath.normalize(path);
	this.print("\t[del] " + path);

	try {
		var stats = fs.statSync(path);

		if (stats && stats.isFile()) {
			fs.unlinkSync(path, function(err) {
				if (err)
					throw err;
			});
		} else if (stats && stats.isDirectory()) {
			var ls = fs.readdirSync(path);
			for ( var int = 0; int < ls.length; int++) {
				var item = ls[int];
				this.del(path + "/" + item);
			}
			fs.rmdirSync(path);
		}
	} catch (e) {
		// nothing to do
	}
};

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
CoffeeMaker.prototype.copy = function(fromPath, toPath, exclude) {
	fromPath = libpath.normalize(fromPath);
	toPath = libpath.normalize(toPath);

	if (exclude && exclude instanceof RegExp && exclude.test(fromPath)) {
		return;
	}
	this.print("\t[copy] " + fromPath + " => " + toPath);

	var stats = fs.statSync(fromPath);
	if (stats && stats.isFile()) {
		var is = fs.createReadStream(fromPath);
		var os = fs.createWriteStream(toPath);
		util.pump(is, os, function(err) {
			if (err) {
				is.destroy();
				os.destroy();
				throw err;
			}
		});
	} else if (stats && stats.isDirectory()) {

		try {
			fs.mkdirSync(toPath, '777');
		} catch (e) {
			// noop
		}

		libpath.existsSync(toPath, function(exists) {
			this.print(exists);
			if (!exists) {

			}
		});
		try {
			var ls = fs.readdirSync(fromPath);
			for ( var int = 0; int < ls.length; int++) {
				var item = ls[int];
				this.copy(fromPath + "/" + item, toPath + "/" + item, exclude);
			}
		} catch (e) {
			this.print("[error]" + e);
			throw e;
		}
	}
}

/**
 * Document javascript files (using required dox)
 * 
 * @param path
 */
CoffeeMaker.prototype.doc = function(path) {

	path = libpath.normalize(path);

	var content = fs.readFileSync(path, 'utf-8');
	var output = "";
	var htmlPath = path.replace('.js', '.html');
	this.print("\t[doc] " + path + " => " + htmlPath);
	var output = dox.render(content, htmlPath);
	this.print(output);
	fs.writeFileSync(htmlPath, output, 'utf-8');

	this.print('ok');
};

/**
 * 
 */
CoffeeMaker.prototype.serve = function(path, port) {
	this.print("[serve] " + path + "@ http://localhost:" + port + "/");
	http.createServer(
			function(request, response) {

				var uri = url.parse(request.url).pathname;
				var filename = libpath.join(path, uri);

				libpath.exists(filename, function(exists) {
					if (!exists) {
						response.writeHead(404, {
							"Content-Type" : "text/plain"
						});
						response.write("404 Not Found\n");
						response.end();
						return;
					}

					if (fs.statSync(filename).isDirectory())
						filename += '/index.html';

					fs.readFile(filename, "binary", function(err, file) {
						if (err) {
							response.writeHead(500, {
								"Content-Type" : "text/plain"
							});
							response.write(err + "\n");
							response.end();
							return;
						}

						var type = mime.lookup(filename);
						response.writeHead(200, {
							"Content-Type" : type
						});
						response.write(file, "binary");
						response.end();
					});
				});
			}).listen(port);
}

/**
 * @private
 */
var $cm = new CoffeeMaker();
$cm.build();

/**
 * @private
 */
function CoffeeMaker() {

	this.version = "0.0.1";
	this.cwd = process.cwd() + "/";
	this.buildSpecPath = this.cwd + "spec.js";
	this.defaultTargetName = "all";
	this.targets = [ this.defaultTargetName ];
	this.stack = [];
}
