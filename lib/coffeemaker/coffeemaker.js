var util = require('util');

function CoffeeMaker() {

	this.version = "0.0.1";
	this.cwd = process.cwd() + "/";
	this.buildSpecPath = this.cwd + "spec.js";
	this.defaultTargetName = "all";
	this.targets = [ this.defaultTargetName ];
}

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
		// if (target == this.defaultTargetName) {
		// var inspected = this.inspect(buildspec);
		// for ( var inspectedTarget = 0; inspectedTarget < inspected.length;
		// inspectedTarget++) {
		// this.execute(buildspec, inspected[inspectedTarget]);
		// }
		// } else {
		//
		// }
	}
};

CoffeeMaker.prototype.execute = function(buildspec, target) {
	this.print("Executing target '" + target + "'");
	
//	this.print(util.inspect(buildspec[target], true, null));
//	this.print(util.inspect(buildspec[target].depends, true, null));
//	this.print(util.inspect(buildspec[target].task, true, null));
	
	if (buildspec[target].depends) {
//		this.print(util.inspect(buildspec[target].depends, true, null));
		
		for ( var int = 0; int < buildspec[target].depends.length; int++) {
			this.print("sub " + buildspec[target].depends[int]);
			this.execute(buildspec, buildspec[target].depends[int]);
		}
	}
	if (buildspec[target].task) {
		buildspec[target].task.call(this, this);
	}

};

CoffeeMaker.prototype.inspect = function(buildspec) {

	this.print("Executing all.");

	var targets = [];

	for ( var exportFunction in buildspec) {
		if (exportFunction != 'init') {
			this.print(exportFunction);
			targets.push(exportFunction);
		}
	}
	return targets;
};

CoffeeMaker.prototype.print = function(message) {
	console.log(message);
};

var fs = require('fs');
var $cm = new CoffeeMaker();

$cm.build();
