var crypto = require('crypto'); // cryptographic functionality (md5)
var through = require('through2'); // a thin wrapper around node transform streams
var gutil = require('gulp-util'); // utilities for gulp plugins

const PLUGIN_NAME = 'gulp-file-to-json';

// Calculate m5d hash
function calcMd5 (data) {
  var cripter = crypto.createHash('md5');
  var md5 = cripter.update(data).digest('hex');

  return md5;
}

// Plugin level function (dealing with files)
module.exports = function () {
    // Creating a stream through which each file will pass
    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            return cb(null, file);
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Stream not supported'));
            return cb(null, file);
        }

        var stringifiedFile = JSON.stringify(file.contents.toString());
        var data = '{"md5":"' + calcMd5(file.contents) + '","value":' + stringifiedFile + '}';

        file.contents = new Buffer(data);
        if (file.path) {
            file.path = gutil.replaceExtension(file.path, '.json');
        }

        cb(null, file);
    });
};
