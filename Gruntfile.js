/*
 * grunt-tree
 * https://github.com/yss/grunt-contrib-tree
 *
 * Copyright (c) 2013 yansong
 * Licensed under the MIT license.
 */

'use strict';

var SRC_PATH = 'test/tree/';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: ['Gruntfile.js', 'tasks/*.js', '<%= nodeunit.tests %>', ],
            options: {
                jshintrc: '.jshintrc',
            },
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp'],
        },

        // Configuration to be run (and then tested).
        tree: {
            noOptions: {
                files: [
                    {
                        src: [SRC_PATH],
                        dest: 'tmp/noOptions.json'
                    }
                ]
            },
            noRecurse: {
                options: {
                    recurse: false
                },
                files: [
                    {
                        src: [SRC_PATH],
                        dest: 'tmp/noRecurse.json'
                    }
                ]
            },
            md5: {
                options: {
                    hash: 'md5',
                    hashLen: 8
                },
                files: [
                    {
                        src: [SRC_PATH],
                        dest: 'tmp/md5.json'
                    }
                ]
            },
            format: {
                options: {
                    format: true
                },
                files: [
                    {
                        src: [SRC_PATH],
                        dest: 'tmp/format.json'
                    }
                ]
            },
            type: {
                options: {
                    type: ['css', 'js']
                },
                files: [
                    {
                        src: [SRC_PATH],
                        dest: 'tmp/type.json'
                    }
                ]
            },
            ext: {
                options: {
                    format: true,
                    ext: {
                        level: 1
                    }
                },
                files: [
                    {
                        src: [SRC_PATH],
                        dest: 'tmp/ext.json'
                    }
                ]
            //},
            //exclude: {
            //    options: {
            //        exclude: ['a.css']
            //    },
            //    files: [
            //        {
            //            src: [SRC_PATH],
            //            dest: 'tmp/exclude.json'
            //        }
            //    ]
            //},
            //excludeAll: {
            //    options: {
            //        exclude: ['*', '**']
            //    },
            //    files: [
            //        {
            //            src: [SRC_PATH],
            //            dest: 'tmp/excludeAll.json'
            //        }
            //    ]
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    // grunt.registerTask('test', ['clean', 'tree', 'nodeunit']);
    grunt.registerTask('test', ['clean', 'jshint', 'tree', 'nodeunit']);

    // By default, lint and run all tests.
    // grunt.registerTask('default', ['jshint', 'test']);

};
