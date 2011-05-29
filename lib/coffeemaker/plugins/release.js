var npm = require('npm'), spawn = require('child_process').spawn, knox = require('knox'), mime = require('mime'), fs = require('fs');
var $cm = require('../core.js');

var _options = {
  archive : {
    'format' : 'zip',
    'dir' : $cm.cwd,
    'destination' : $cm.cwd + "archive.zip"
  },
  s3 : {
    accesskey : '',
    secretkey : '',
    bucket : 'default',
    acl : 'public-read',
    source : $cm.cwd
  }
};

var archive = function (options) {
  $cm.inherit(options, _options);

  $cm.info("", "\t[release]");

  $cm.info(_options.archive.dir + " => " + _options.archive.destination, "\t\t\t[archive] ");
  var zip = spawn('zip', [ '-r', _options.archive.destination, '.' ], {
    cwd : _options.archive.dir
  });

  zip.on('exit', function (code) {
  });
};

var s3 = function (options) {
  $cm.inherit(options, _options);

  $cm.info("in " + _options.s3.bucket, "\t[release]");

  var client = knox.createClient( {
    key : _options.s3.accesskey,
    secret : _options.s3.secretkey,
    bucket : _options.s3.bucket
  });

  var fileset = $cm.plugins.fileset;
  fileset.list(_options.s3.source, function (err, file) {
    var stat = fs.lstatSync(file);
    if (stat.isFile()) {
      var destination = file.replace(_options.s3.source, '');
      var type = mime.lookup(file);

      fs.readFile(file, function (err, buf) {

        var req = client.put(destination, {
          'Content-Length' : buf.length,
          'Content-Type' : type,
          'x-amz-acl': _options.s3.acl
        });
        req.on('response', function (res) {
          if (200 == res.statusCode) {
            $cm.info(file + " => " + req.url + " (" + type + ")", "\t\t\t[s3] ");
          }
          else {
            $cm.error(res.statusCode + " : " + file + " => " + req.url + " (" + type + ")", "\t\t\t[s3] ");
          }
        });
        req.end(buf);
      });
    }
  });
};

var publish = function () {

};

exports.archive = archive;
exports.s3 = s3;
exports.npm = npm;
