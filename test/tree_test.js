'use strict';

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

exports.tree = {
    setUp: function(done) {
        // setup here if necessary
        done();
    },
    noOptions: function(test) {
        test.expect(1);

        var actual = grunt.file.readJSON('tmp/noOptions.json'),
            expected = grunt.file.readJSON('test/expected/noOptions.json');

        test.deepEqual(actual, expected, 'Not equal at noOptions method.');
        test.done();
    },
    noRecurse: function(test) {
        test.expect(1);

        var actual = grunt.file.readJSON('tmp/noRecurse.json'),
            expected = grunt.file.readJSON('test/expected/noRecurse.json');

        test.deepEqual(actual, expected, 'Not equal at noRecurse method.');
        test.done();
    },
    md5: function(test) {
        test.expect(1);

        var actual = grunt.file.readJSON('tmp/md5.json'),
            expected = grunt.file.readJSON('test/expected/md5.json');

        test.deepEqual(actual, expected, 'Not equal at md5 method.');
        test.done();
    },
    format: function(test) {
        test.expect(1);

        var actual = grunt.file.readJSON('tmp/format.json'),
            expected = grunt.file.readJSON('test/expected/format.json');

        test.deepEqual(actual, expected, 'Not equal at format method.');
        test.done();
    },
    type: function(test) {
        test.expect(1);

        var actual = grunt.file.readJSON('tmp/type.json'),
            expected = grunt.file.readJSON('test/expected/type.json');

        test.deepEqual(actual, expected, 'Not equal at type method.');
        test.done();
    }
};
