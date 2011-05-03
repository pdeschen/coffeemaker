var util = require('util');
var template = require('./../../lib/coffeemaker/plugins/template.js');

template.html("Welcome, {{name}}!", {name: "John Smith"}, function(html) {
	console.log(html);
});

template.render('./test.mustache',{name: "Jane Doe"} , function(html) {
	console.log(html);
});

// using partials
template.render('./foo.mustache',{name: "Foo Bar"} , function(html) {
	console.log(html);
});
