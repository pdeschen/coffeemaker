var util = require('util'), fs = require('fs');
var template = require('./../../lib/coffeemaker/plugins/template.js');

//template.renderTo('./foo.mustache', {name : "Foo Bar"}, './html');
template.renderTo('.', {name : "Foo Bar"}, './html');

//template.renderTo('.', {name : "Foo Bar"}, './html');
//
//template.html("Welcome, {{name}}!", {name : "John Smith"}, function(data) {
//	console.log(data.html);
//});
//
//template.render('./test.mustache', {name : "Jane Doe"}, function(data) {
//	console.log(data.html);
//});
//
//// using partials
//template.render('./foo.mustache', {name : "Foo Bar"}, function(data) {
//	console.log(data.html);
//});
//
//fs.rmdir( './html');

