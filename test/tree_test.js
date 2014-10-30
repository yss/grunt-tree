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

var expectedDir, expectedWinDir, platform = os.platform();

expectedDir = "test/expected/"; 

// Windows render MD5 hashes differently.
if (platform === "win32" || platform === "win63") {
    expectedWinDir = "test/expected/win/"; 
} else {
    expectedWinDir = expectedDir;
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
            expected = grunt.file.readJSON(expectedWinDir + 'md5.json');

        test.deepEqual(actual, expected, 'Not equal at md5 method.');
        test.done();
    },
    format: function(test) {
        test.expect(1);

        var actual = grunt.file.readJSON('tmp/format.json'),
            expected = grunt.file.readJSON(expectedDir + 'format.json');

        test.deepEqual(actual, expected, 'Not equal at format method.');
        test.done();
    },
    ext: function(test) {
        test.expect(1);

        var actual = grunt.file.readJSON('tmp/ext.json'),
            expected = grunt.file.readJSON(expectedDir + 'ext.json');

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
    base: function(test) {
        test.expect(1);

        var actual = grunt.file.readJSON('tmp/base.json'),
            expected = grunt.file.readJSON(expectedDir + 'base.json');

        test.deepEqual(actual, expected, 'Not equal at exclude method.');
        test.done();
    },
    multiple: function(test) {
        test.expect(2);

        var actual1 = grunt.file.readJSON('tmp/multiple1.json'),
            expected1 = grunt.file.readJSON(expectedDir + 'multiple1.json'),
            actual2 = grunt.file.readJSON('tmp/multiple2.json'),
            expected2 = grunt.file.readJSON(expectedDir + 'multiple2.json');

        test.deepEqual(actual1, expected1, 'Not equal at exclude method.');
        test.deepEqual(actual2, expected2, 'Not equal at exclude method.');
        test.done();
    }
};
