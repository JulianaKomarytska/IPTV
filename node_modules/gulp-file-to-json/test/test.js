var assert = require('assert');
var es = require('event-stream');
var File = require('vinyl');
var file2json = require('../');

describe('gulp-file2json', function () {
    describe('in buffer mode', function () {
        it('output file contents and md5 in json format', function (done) {
            // create the fake file
            var fakeFile = new File({
                contents: new Buffer('abufferwiththiscontent')
            });

            // create a file2json plugin stream
            var myfile2json = file2json();

            // write the fake file to it
            myfile2json.write(fakeFile);

            // wait for the file to come back out
            myfile2json.once('data', function (file) {
                // make sure it came out the same way it went in
                assert(file.isBuffer());

                // check the contents
                assert.equal(file.contents.toString('utf8'), '{"md5":"2f280040e4a5f6d73fc38d6dd48dbb50","value":"abufferwiththiscontent"}');
                done();
            });
        });
    });
});
