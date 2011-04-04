var util = require('util');

var fs = require('fs');


exports.build = function() {
	var $cm = new CoffeeMaker();

	$cm.build();
};

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
	this.print("building '" + this.targets + "'");

	for ( var int = 0; int < this.targets.length; int++) {
		var target = this.targets[int];
		this.execute(buildspec, target);
	}
};

CoffeeMaker.prototype.execute = function(buildspec, target) {
	this.stack.push(target);
	this.print("(" + target + ") ");
	
	if (buildspec[target].depends) {
//		this.print(util.inspect(buildspec[target].depends, true, null));
		
		for ( var int = 0; int < buildspec[target].depends.length; int++) {
			this.print("(" + target + "." + buildspec[target].depends[int] + ") ");
			this.execute(buildspec, buildspec[target].depends[int]);
		}
	}
	if (buildspec[target].task) {
		buildspec[target].task.call(this, this);
	}

};

CoffeeMaker.prototype.print = function(message) {
	console.log(message);
};

CoffeeMaker.prototype.copy = function(fromPath, toPath)
{
	this.print("\t[copy] " + fromPath + " => " + toPath);
	
	var stats = fs.statSync(fromPath);
	if (stats && stats.isFile()) {
		var is = fs.createReadStream(fromPath);
		var os = fs.createWriteStream(toPath);
		try {
			util.pump(is, os);
			is.close();
			os.close();
		} catch (e) {
			is.close();
			os.close();
		}
	}
	else if (stats && stats.isDirectory()) {
		
		try {
			fs.mkdirSync(toPath, '777');
		} catch (e) {
			// no-op
		}
		
		try {
			var ls = fs.readdirSync(fromPath);
			for ( var int = 0; int < ls.length; int++) {
				var item = ls[int];
				this.copy(fromPath + "/" + item, toPath + "/"  + item);			
			}
		} catch (e) {
			// no-op
		}
	}
}

var $cm = new CoffeeMaker();
$cm.build();

function CoffeeMaker() {

	this.version = "0.0.1";
	this.cwd = process.cwd() + "/";
	this.buildSpecPath = this.cwd + "spec.js";
	this.defaultTargetName = "all";
	this.targets = [ this.defaultTargetName ];
	this.stack = [];
}
