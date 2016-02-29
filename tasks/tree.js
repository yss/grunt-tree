/*
 * grunt-tree
 * https://github.com/yss/grunt-tree
 *
 * Copyright (c) 2013 yansong
 * Licensed under the MIT license.
 */

'use strict';

var Path = require('path'),
    FS = require('fs'),
    Crypto = require('crypto');

// overrides the origin object
function mix(o, s) {
    for (var key in s) {
        o[key] = s[key];
    }
}

/**
 * parse a directory to json
 */
function Tree(grunt, files, options) {
    this.grunt = grunt;
    this.files = files;
    this.options = options;
    this.init();
}

mix(Tree.prototype, {
    /**
     * get filename with version if possible
     * if options.hash
     * name.js => version-name.js
     * name => version-name
     * @param {String} abspath
     * @param {String} filename
     * @return {String}
     */
    getFileName: function(abspath, filename) {
        if (this.options.hash) {
            var version = Crypto.createHash(this.options.hash).update(FS.readFileSync(abspath)).digest('hex');
            if (this.options.hashLen) {
                version = version.slice(0, this.options.hashLen);
            }
            return version + '-' + filename;
        }
        return filename;
    },

    /**
     * build a tree
     * @param {String} abspath
     * @param {String} subdir
     * @param {String} filename
     */
    toTree: function(abspath, subdir, filename) {
        var grunt = this.grunt,
            options = this.options;
        // ignore hidden file
        if (filename.indexOf('.') === 0) {
            grunt.log.writeln('Ignore file: ' + filename);
            return;
        }
        if (grunt.file.isFile(abspath)) {
            // not the given type
            if (options._typeReg && !options._typeReg.test(filename)) {
                return;
            }

            var filenameWithVersion = this.getFileName(abspath, filename);
            /**
             * _tree = {
             *  "relativePath": "filenameWithVersion"
             * }
             */
            this._tree[Path.join(options.cwd, subdir || '', filename)] = filenameWithVersion;

            if (typeof options.outputDirectory !== 'undefined') {
                if (options._outputTypeReg && !options._outputTypeReg.test(filename)) {
                    return;
                }
                filename = Path.join(options.outputDirectory, filenameWithVersion);

                grunt.file.copy(abspath, filename);
                grunt.log.write('File "' + filename + '" is created.');
            }
        }
    },

    /**
     * output a tree without format
     * { "relativePath": "filenameWithVersion" }
     * =====>>>>>>>
     * { "pathname" : { "pathname": "filenameWithVersion" } }
     *
     * @returns {Object}
     */
    parseTreeWithoutFormat: function() {
        var tree = this._tree,
            newTree = {};

        Object.keys(tree).forEach(function(relativePath) {
            var tmpTree = newTree;
            var pathArr = relativePath.split(Path.sep),
                filename = pathArr.pop();

            pathArr.forEach(function(pathname) {
                if (!tmpTree[pathname]) {
                    tmpTree[pathname] = {};
                }

                tmpTree = tmpTree[pathname];
            });

            tmpTree[filename] = tree[relativePath];
        });

        return newTree;
    },

    init: function() {
        var _this = this,
            options = _this.options;
        _this.files.forEach(function(file) {
            _this._tree = {};
            file.src.forEach(function(filepath) {
                if (options.cwd) {
                    filepath = Path.join(filepath, options.cwd);
                }

                if (options.recurse) {
                    _this.grunt.file.recurse(filepath, function(abspath, rootdir, subdir, filename) {
                        _this.toTree(abspath, subdir, filename);
                    });
                } else {
                    var files = FS.readdirSync(filepath);
                    files.forEach(function(filename) {
                        _this.toTree(Path.join(filepath, filename), '', filename);
                    });
                }
            });

            if (!options.format) {
                _this._tree = _this.parseTreeWithoutFormat();
            }

            _this.grunt.file.write(file.dest, JSON.stringify(_this._tree, null, options.prettify));

            _this.grunt.log.writeln('File "' + file.dest + '" created.');
        });
    }
});

module.exports = function(grunt) {
    grunt.registerMultiTask('tree', 'Parse a directory to a tree with json format.', function() {
        var options = this.options({
            prettify: 0, // number or boolean
            recurse: true,
            // type: [],
            // hash: 'md5',
            // hashLen: 8,
            // outputType: [],
            // outputDirectory: '',
            cwd: '', // relative to the src directory
            format: false
        });

        if (grunt.util.kindOf(options.prettify) === 'boolean') {
            options.prettify = options.prettify ? 4 : 0;
        } else if (grunt.util.kindOf(options.prettify) !== 'number') {
            options.prettify = 0;
        }

        if (grunt.util.kindOf(options.type) === 'array') {
            options._typeReg = new RegExp('\\.(?:' + options.type.join('|') + ')$');
        }

        if (grunt.util.kindOf(options.outputType) === 'array') {
            options._outputTypeReg = new RegExp('\\.(?:' + options.outputType.join('|') + ')$');
        }

        new Tree(grunt, this.files, options);
    });
};
