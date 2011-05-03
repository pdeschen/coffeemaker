var path = require('path'), http = require("http"), url = require("url"), mime = require('mime'), fs = require('fs');

var $cm = require('../core.js');

exports.http = function(webpath, port) {
	
	$cm.print('Serving ' + webpath + ' @ http://localhost:' + port + '/');
	http.createServer(function(request, response) {
		var uri = url.parse(request.url).pathname;
		var filename = path.join(webpath, uri);

		path.exists(filename, function(exists) {
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
};