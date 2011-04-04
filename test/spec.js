exports.init = function(cm, all) {
	all.depends = ['render', 'publish'];
	cm.print("tata");
};

exports.render  = function(cm) {
	cm.print("test");
	
	var mustache = require('mustache');
	var sys = require('sys');
	
	var view = {
	  title: "Joe",
	  calc: function() {
	    return 2 + 4;
	  }
	};

	var template = "{{title}} spends {{calc}}";

	var html = mustache.to_html(template, view);
	
	cm.print(html);	
};


