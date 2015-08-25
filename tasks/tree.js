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
 *
 */
function Tree(grunt, files, options) {
    this.grunt = grunt;
    this.files = files;
    this.options = options;
    this.init();
}

mix(Tree.prototype, {
    // for windows user
    getUNCPath: function(file) {
        if (this.options.isUNCPath && Path.sep !== '/') {
            return file.replace(new RegExp('\\' + Path.sep, 'g'), '/');
        } else {
            return file;
        }
    },

    //
    getFileName: function(abspath, filename) {
        if (this.options.hash) {
            var version = Crypto.createHash(this.options.hash).update(FS.readFileSync(abspath)).digest('hex');
            if (this.options.hashLen) {
                version = version.slice(0, this.options.hashLen);
            }
            return this.getFileNameWithVersion(filename, version);
        }
        return filename;
    },

    /**
     * name.js => name.version.js
     * name => name.version
     */
    getFileNameWithVersion: function(filename, version) {
        filename = filename.split('.');
        filename.splice(Math.max(filename.length - 1, 1), 0, version);
        return filename.join('.');
    },

    // get the prefix with subdir
    getKeyName: function (subdir, filename) {
        var prefix;
        filename = this.getFileName(filename);
        if (this.options.ext.level > 0 && subdir) {
            prefix = subdir.split(Path.sep)[this.options.ext.level - 1];
            if (prefix) {
                filename = prefix + this.options.ext.hyphen + filename;
            }
        }
        return filename;
    },

    toTree: function(abspath, subdir, filename) {
        var grunt = this.grunt,
            options = this.options;
        var extFileName;
        // ensure subdir is not undefined
        subdir = subdir || "";
        // ignore hidden file
        if (filename.indexOf('.') === 0) {
            grunt.log.writeln('Ignore file: ' + filename);
            return;
        }
        if (grunt.file.isFile(abspath)) {
            // not the given type
            if (this._typeReg && !this._typeReg.test(filename)) {
                return;
            }
            if (options.format) {
                extFileName = this.getKeyName(subdir, filename);
            } else {
                extFileName = this.getFileName(subdir.replace(/[\\\/\.]+/g,'') + filename);
            }
            this._tree[extFileName] = Path.join(options.cwd, subdir, this.getFileName(abspath, filename));
        }
    },

    /**
     * parse a path object to a tree object
     */
    parseTreeWithNoFormat: function () {
        var obj = this._tree;
        var key, i, arr, len, tmp, fileArr,
            tree = {};
        for (key in obj) {
            tmp = tree;
            arr = obj[key].split(Path.sep);

            for (i = 0, len = arr.length - 1; i < len; i++) {
                if (!tmp[arr[i]]) {
                    tmp[arr[i]] = {};
                }
                tmp = tmp[arr[i]];
            }

            // handle last one
            fileArr = arr[i].split('.');
            if (this.options.hash) {
                fileArr.pop();
            }
            // if has postfix, remove it
            if (fileArr.length > 1) {
                fileArr.pop();
            }
            // get the origin value
            tmp[fileArr.join('.')] = this.getUNCPath(obj[key]);
        }

        return tree;
    },

    init: function() {
        var _this = this,
            options = _this.options;
        this._tree = {};
        _this.files.forEach(function(filepath) {
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

            if (!options.format) {
                _this._tree = this.parseTreeWithNoFormat();
            }

            _this.grunt.file.write(filepath.dest, JSON.stringify(_this._tree, null, options.prettify ? 2 : 0));

            _this.grunt.log.writeln('File "' + filepath.dest + '" created.');
        });
    }
});

module.exports = function(grunt) {
    grunt.registerMultiTask('tree', 'Parse a directory to a tree with json format.', function() {
        var options = this.options({
            // prettify: function(data){ return data },
            recurse: true,
            // type: [],
            ext: { // can be covered
                // level: 0,
                // hyphen: '-'
            },
            //hash: 'md5:10',
            cwd: '', // relative to the src directory
            isUNCPath: false,
            format: false
        });

        if (!options.ext.hyphen) {
            options.ext.hyphen = '-';
        }

        if (options.ext.level > 0 && !options.format) {
            grunt.fail.fatal('For use the ext option, you must set "format: true" in your options.');
            return;
        }

        if (grunt.util.kindOf(options.type) === 'array') {
            options._typeReg = new RegExp('\\.(?:' + options.type.join('|') + ')$');
        }

        new Tree(grunt, this.files, options);
    });
};
