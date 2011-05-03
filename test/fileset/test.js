var util = require('util');
var fileset = require('./../../lib/coffeemaker/plugins/fileset.js');

var list = fileset.listSync('../');
console.log(list);

// with filtering
var list = fileset.listSync('../', function(file){
	console.log("filtering " + file);
	return /(.*).js/.test(file);
});
console.log(list);

var callback = function(err, file) {
	if (file) {
		console.log(fileset.name(file));		
	}
};

fileset.list('../', callback);

