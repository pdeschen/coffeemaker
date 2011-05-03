var util = require('util');
var fileset = require('./../../lib/coffeemaker/plugins/fileset.js');

fileset.mkdirs('/var/tmp/foo1/bar1/foo2/bar2');
fileset.copy('.', '/var/tmp/foobar');
fileset.del('/var/tmp/foobar');

var list = fileset.listSync('.');
console.log(list);

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



