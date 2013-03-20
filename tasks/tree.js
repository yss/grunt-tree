/*
 * grunt-tree
 * https://github.com/yss/grunt-tree
 *
 * Copyright (c) 2013 yansong
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path'),
    fs = require('fs'),
    crypto = require('crypto');

module.exports = function(grunt) {
    grunt.registerMultiTask('tree', 'Parse a directory to a tree with json format.', function() {
        var options = this.options({
            recursion: true,
            type: [],
            md5: false,
            format: false
        });

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
                grunt.file.recurse(filepath, function(abspath, rootdir, subdir, filename) {
                    grunt.log.writeln(filename);
                    // ignore hidden file
                    if (filename.indexOf('.') === 0) {
                        return;
                    }
                    if (grunt.file.isFile(abspath)) {
                        tree[getFileName(filename)] = path.join(subdir, getMd5Name(abspath, filename, options.md5));
                    }
                });
            });


            console.log(tree);
            if (!options.format) {
                tree = parseToTree(tree, options.md5);
            }
            console.log(tree);

            grunt.file.write(f.dest, JSON.stringify(tree));
            grunt.log.writeln('File "' + f.dest + '" created.');
        });
    });

};

/**
 * parse a path object to a tree object
 */
function parseToTree(obj, md5) {
    var key, i, arr, len, tmp,
        tree = {};
    for (key in obj) {
        tmp = tree;
        obj[key].split(path.sep).forEach(function(item, i, arr) {
            // last
            if (i === arr.length - 1) {
                var fileArr = item.split('.');
                if (md5) {
                    fileArr.pop();
                    if (fileArr.length > 1) {
                        fileArr.pop();
                    }
                }
                // get the origin value
                tmp[fileArr.join('.')] = arr.join(path.sep);
            } else {
                tmp = tmp[item] = {};
            }
        });
    }

    return tree;
}

// file with lost postfix
function getFileName(filename, version) {
    var pos = filename.lastIndexOf('.');
    if (version) {
        version = '.' + version;
        return ~pos ? filename.substring(0, pos) + version + filename.slice(pos) : filename + version;
    } else {
        return ~pos ? filename.substring(0, pos) : filename;
    }
};

function getMd5Name(abspath, filename, md5) {
    if (md5) {
        var len = typeof md5 === 'number' ? md5 : 0,
            version = md5(fs.readFileSync(abspath), '', len);
        return getFileName(filename, version);
    }
    return filename;
};

// get md5 version of file
function md5(str, encoding, len) {
    str = str || Math.random().toString();
    str = crypto.createHash('md5').update(str).digest(encoding || 'hex');
    return len ? str.slice(0, len) : str;
};
