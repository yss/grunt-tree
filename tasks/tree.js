/*
 * grunt-tree
 * https://github.com/yss/grunt-tree
 *
 * Copyright (c) 2013 yansong
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
    'use strict';

    var Path = require('path'),
        FS = require('fs'),
        Crypto = require('crypto');

    grunt.registerMultiTask('tree', 'Parse a directory to a tree with json format.', function() {
        var options = this.options({
            prettify: true,
            ext: {
                // level: 0,
                // hyphen: '-'
            },
            md5: false,
            uncpath: true,
            format: false
        }), tree = {};

        if (!options.ext.hyphen) {
            options.ext.hyphen = '-';
        }

        if (options.ext.level > 0 && !options.format) {
            grunt.fail.fatal('For use the ext option, you must set "format: true" in your options.');
            return;
        }
        
        // Each set of files.
        this.files.forEach(function(f) {
            var files = f;

            f.src.forEach(function(path) {
                var key, cwd, filename, subdir, subdirReg, value;
                
                // File exists.
                if (!grunt.file.exists(path)) {
                    grunt.log.warn('Source file "' + path + '" not found.');
                    return false;
                // Ignore folders.
                } else if (grunt.file.isDir(path)) {
                    return false;
                // Ignore hidden file
                } else if (path.indexOf('.') === 0) {
                    grunt.log.writeln('Ignore file: ' + path);
                    return false;
                } 

                cwd = files.orig.cwd;
                filename = path.split('/').pop();

                // Remove cwd and filename from path to get subdir
                subdirReg = new RegExp('(^' + cwd + '\/*)|(' + filename + '$)', 'g');
                subdir = (cwd)? path.replace(subdirReg, '') : '';
                
                if (options.format) {
                    key = getExtFileName(subdir, options.ext, filename);
                } else {
                    // Remove separators.
                    key = getFileName(subdir.replace(/[\\\/\.]+/g,'') + filename);
                }

                value = Path.join(subdir, getMd5FileName(path, filename, options.md5)); 
                value = getUNCPath(value, options.uncpath);
                tree[key] = value;
            });
        });
        
        if (!options.format) {
            tree = parseToTree(tree, options.md5);
        }

        // Write tree to file.
        var dest = this.files[0].orig.dest;
        grunt.file.write(dest, JSON.stringify(tree, null, options.prettify ? 2 : 0));
        grunt.log.writeln('File "' + dest + '" created.');
    });

    // Parse a path value to a tree object.
    function parseToTree(obj, md5) {
        var key, i, arr, len, tmp, fileArr,
            tree = {};

        for (key in obj) {
            tmp = tree;
            // Split paths up.
            arr = obj[key].split('/');

            // Loop path segments and create recursive objects.
            for (i = 0, len = arr.length - 1; i < len; i++) {
                if (!tmp[arr[i]]) {
                    tmp[arr[i]] = {};
                }
                // Set tmp to just created / iterated object.
                tmp = tmp[arr[i]];
            }

            // Handle last one
            fileArr = arr[i].split('.');
            if (md5) {
                fileArr.pop();
            }
            // If has postfix, remove it
            if (fileArr.length > 1) {
                fileArr.pop();
            }
            // Get the origin value
            tmp[fileArr.join('.')] = obj[key];
        }
        return tree;
    }

    // Convert path separators to fordslashes.
    function getUNCPath(path, isUNCPath) {
        if (isUNCPath && Path.sep !== '/') {
            return path.replace(new RegExp('\\' + Path.sep, 'g'), '/');
        } else {
            return path;
        }
    }

    // Return the filename without the extension.
    function getFileName(filename, md5Value) {
        var pos = filename.lastIndexOf('.');
        if (md5Value) {
            md5Value = '.' + md5Value;
            return ~pos ? filename.substring(0, pos) + md5Value + filename.slice(pos) : filename + md5Value;
        } else {
            return ~pos ? filename.substring(0, pos) : filename;
        }
    }

    // Return the filename with prefixed subdir value.
    function getExtFileName(subdir, ext, filename) {
        var prefix;
        filename = getFileName(filename);
        if (ext.level > 0 && subdir) {
            prefix = subdir.split('/')[ext.level - 1];
            if (prefix) {
                filename = prefix + ext.hyphen + filename;
            }
        }
        return filename;
    }

    // Return the filename with appended MD5.
    function getMd5FileName(path, filename, md5) {
        if (md5) {
            var len = (typeof md5 === 'number') ? md5 : 0,
                md5Value = getMd5Value(FS.readFileSync(path), '', len);
            return getFileName(filename, md5Value);
        }
        return filename;
    }

    // Return the MD5 value of a string.
    function getMd5Value(str, encoding, len) {
        str = str || Math.random().toString();
        str = Crypto.createHash('md5').update(str).digest(encoding || 'hex');
        return len ? str.slice(0, len) : str;
    }
};