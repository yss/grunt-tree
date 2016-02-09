/*
 * grunt-tree
 * https://github.com/honkskillet/grunt-file-tree
 *
 * Copyright (c) 2016 Alexander White
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
 *
 */
function Tree(grunt, files, options) {
    this.grunt = grunt;
    this.files = files;
    this.options = options;
    this.init();
}

mix(Tree.prototype, {

    toTree: function(abspath, subdir, filename) {
        var grunt = this.grunt;
        // ensure subdir is not undefined
        subdir = subdir || "";
        // ignore hidden file
        if (filename.indexOf('.') === 0) {
            grunt.log.writeln('Ignore file: ' + filename);
            return;
        }
        if (grunt.file.isFile(abspath)) {
            this._tree[subdir+"/"+filename] = filename;
        }
    },

    /**
     * parse a path object to a tree object
     */
    parseTree: function () {
        var obj = this._tree;
        var key, i, arr, len, tmp, fileArr,
            tree = {};
        for (key in obj) {
            tmp = tree;
            arr = key.split('/');

            for (i = 0; i < arr.length - 1; i++) {
                if (!tmp[arr[i]]) {
                    tmp[arr[i]] = {};
                }
                tmp = tmp[arr[i]];
            }
            // handle last one
            tmp[arr[i]]=key;
        }
        return tree;
    },

    init: function() {
        var _this = this,
            options = _this.options;
        _this.files.forEach(function(file) {
            _this._tree = [];
            file.src.forEach(function(filepath) {
                if (options.cwd) {
                    filepath = Path.join(filepath, options.cwd);
                }
                _this.grunt.file.recurse(filepath, function(abspath, rootdir, subdir, filename) {
                    _this.toTree(abspath, subdir, filename);
                });
            });
            _this._tree = _this.parseTree();
            _this.grunt.file.write(file.dest, JSON.stringify(_this._tree, null, options.prettify ? 2 : 0));
            _this.grunt.log.writeln('File "' + file.dest + '" created.');
        });
    }
});

module.exports = function(grunt) {
    grunt.registerMultiTask('fileTree', 'Parse a directory to a tree with json format.', function() {
        var options = this.options({
            cwd: '', // relative to the src directory
            prettify: false, 
        });
        new Tree(grunt, this.files, options);
    });
};
