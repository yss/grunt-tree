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

function getUNCPath(file, isUNCPath) {
    if (isUNCPath && Path.sep !== '/') {
        return file.replace(new RegExp(Path.sep, 'g'), '/');
    } else {
        return file;
    }
}

// file with lost postfix
function getFileNameWithVersion(filename, version) {
    var pos = filename.lastIndexOf('.');
    version = '.' + version;
    return ~pos ? filename.substring(0, pos) + version + filename.slice(pos) : filename + version;
}

// get md5 version of file
function getMd5Version(str, encoding, len) {
    str = str || Math.random().toString();
    str = Crypto.createHash('md5').update(str).digest(encoding || 'hex');
    return len ? str.slice(0, len) : str;
}

function getMd5Name(abspath, filename, md5) {
    if (md5) {
        var len = typeof md5 === 'number' ? md5 : 0,
            version = getMd5Version(FS.readFileSync(abspath), '', len);
        return getFileNameWithVersion(filename, version);
    }
    return filename;
}

module.exports = function(grunt) {
    grunt.registerMultiTask('tree', 'Parse a directory to a tree with json format.', function() {
        var options = this.options({
            prettify: false,
            exclude: [],
            type: [],
            md5: false,
            cwd: '', // relative to the src directory
            uncpath: false
        }), typeReg;

        if (options.type.length &&  grunt.util.kindOf(options.type) === 'array') {
            typeReg = new RegExp('\\.(?:' + options.type.join('|') + ')$');
        } else {
            typeReg = false;
        }

        this.files.forEach(function(f) {
            var tree = {};
            f.src.filter(function(filepath) {
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).forEach(function(filepath) {
                if (options.cwd) {
                    filepath = Path.join(filepath, options.cwd);
                }
                grunt.file.recurse(filepath, function(abspath, rootdir, subdir, filename) {
                    toTree(abspath, rootdir, subdir, filename);
                });
            });

            function toTree(abspath, rootdir, subdir, filename) {
                var relFilePath;
                // ensure subdir is not undefined
                subdir = subdir || "";
                // ignore hidden file
                if (filename.indexOf('.') === 0) {
                    grunt.log.writeln('Ignore file: ' + filename);
                    return;
                }
                if (grunt.file.isFile(abspath)) {
                    // not the given type
                    if (typeReg && !typeReg.test(filename)) {
                        return;
                    }
                    if (options.exclude && options.exclude.length) {
                        if (grunt.file.match(options.exclude,
                            getUNCPath(Path.join(subdir, filename), options.uncpath)).length) {
                            return;
                        }
                    }

                    relFilePath = abspath.replace(rootdir, '');
                    tree[relFilePath] = Path.join(options.cwd, subdir, getMd5Name(abspath, filename, options.md5));
                }
            }

            grunt.file.write(f.dest, JSON.stringify(tree, null, options.prettify ? 2 : 0));

            grunt.log.writeln('File "' + f.dest + '" created.');
        });
    });

};
