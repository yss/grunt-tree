'use strict';

var os = require('os');
var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

var expectedDir, platform = os.platform();

// Windows render MD5 hashes differently.
// UNC paths change when format is used, so lets
// create corresponding, expected results for windows.
if (platform === "win32" || platform === "win63") {
    expectedDir = "test/expected/win/"; 

} else {
    expectedDir = "test/expected/"; 
}

exports.tree = {
    setUp: function(done) {
        // setup here if necessary
        done();
    },
    noOptions: function(test) {
        test.expect(1);

        var actual = grunt.file.readJSON('tmp/noOptions.json'),
            expected = grunt.file.readJSON(expectedDir + 'noOptions.json');

        test.deepEqual(actual, expected, 'Not equal at noOptions method.');
        test.done();
    },
    md5: function(test) {
        test.expect(1);

        var actual = grunt.file.readJSON('tmp/md5.json'),
            expected = grunt.file.readJSON(expectedDir + 'md5.json');

        test.deepEqual(actual, expected, 'Not equal at md5 method.');
        test.done();
    },
    type: function(test) {
        test.expect(1);

        var actual = grunt.file.readJSON('tmp/type.json'),
            expected = grunt.file.readJSON(expectedDir + 'type.json');

        test.deepEqual(actual, expected, 'Not equal at type method.');
        test.done();
    },
    exclude: function(test) {
        test.expect(1);

        var actual = grunt.file.readJSON('tmp/exclude.json'),
            expected = grunt.file.readJSON(expectedDir + 'exclude.json');

        test.deepEqual(actual, expected, 'Not equal at exclude method.');
        test.done();
    },

    excludeAll: function(test) {
        test.expect(1);

        var actual = grunt.file.readJSON('tmp/excludeAll.json'),
            expected = grunt.file.readJSON(expectedDir + 'excludeAll.json');

        test.deepEqual(actual, expected, 'Not equal at excludeAll method.');
        test.done();
    }
};
