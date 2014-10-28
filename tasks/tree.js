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
        return file.replace(new RegExp('\\' + Path.sep, 'g'), '/');
    } else {
        return file;
    }
}

/**
 * parse a path object to a tree object
 * @param {Object} obj
 * @param {Number|Boolean} md5
 * @param {Boolean} isUNCPath
 * @return {Object}
 */
function parseToTree(obj, md5, isUNCPath) {
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
        if (md5) {
            fileArr.pop();
        }
        // if has postfix, remove it
        if (fileArr.length > 1) {
            fileArr.pop();
        }
        // get the origin value
        tmp[fileArr.join('.')] = getUNCPath(obj[key], isUNCPath);
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
}

// get the prefix with subdir
function getExtFileName(subdir, ext, filename) {
    var prefix;
    filename = getFileName(filename);
    if (ext.level > 0 && subdir) {
        prefix = subdir.split(Path.sep)[ext.level - 1];
        if (prefix) {
            filename = prefix + ext.hyphen + filename;
        }
    }
    return filename;
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
        return getFileName(filename, version);
    }
    return filename;
}

module.exports = function(grunt) {
    grunt.registerMultiTask('tree', 'Parse a directory to a tree with json format.', function() {
        var options = this.options({
            prettify: false,
            recurse: true,
            // exclude: [],
            // type: [],
            ext: { // can be covered
                // level: 0,
                // hyphen: '-'
            },
            md5: false,
            cwd: '', // relative to the src directory
            uncpath: false,
            format: false
        }), typeReg;

        if (!options.ext.hyphen) {
            options.ext.hyphen = '-';
        }

        if (options.ext.level > 0 && !options.format) {
            grunt.fail.fatal('For use the ext option, you must set "format: true" in your options.');
            return;
        }

        if (grunt.util.kindOf(options.type) === 'array') {
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
                if (options.recurse) {
                    grunt.file.recurse(filepath, function(abspath, rootdir, subdir, filename) {
                        toTree(abspath, subdir, filename);
                    });
                } else {
                    var files = FS.readdirSync(filepath);
                    files.forEach(function(filename) {
                        toTree(Path.join(filepath, filename), './', filename);
                    });
                }
            });

            function toTree(abspath, subdir, filename) {
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
                    if (typeReg && !typeReg.test(filename)) {
                        return;
                    }
                    if (options.exclude) {
                        if (grunt.file.match(options.exclude,
                            getUNCPath(Path.join(subdir, filename), options.uncpath)).length) {
                            return;
                        }
                    }
                    if (options.format) {
                        extFileName = getExtFileName(subdir, options.ext, filename);
                    } else {
                        extFileName = getFileName(subdir.replace(/[\\\/\.]+/g,'') + filename);
                    }
                    tree[extFileName] = Path.join(options.cwd, subdir, getMd5Name(abspath, filename, options.md5));
                }
            }


            if (!options.format) {
                tree = parseToTree(tree, options.md5, options.uncpath);
            }

            grunt.file.write(f.dest, JSON.stringify(tree, null, options.prettify ? 2 : 0));

            grunt.log.writeln('File "' + f.dest + '" created.');
        });
    });

};
