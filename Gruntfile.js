/*
 * grunt-tree
 * https://github.com/yss/grunt-contrib-tree
 *
 * Copyright (c) 2013 yansong
 * Licensed under the MIT license.
 */

'use strict';

var BASE = 'test/tree/';

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
                src: [BASE + '**'],
                dest: 'tmp/noOptions.json'
            },
            md5: {
                options: {
                    md5: 8
                },
                src: [BASE + '**'],
                dest: 'tmp/md5.json'
            },
            format: {
                options: {
                    format: true
                },
                src: [BASE + '**'],
                dest: 'tmp/format.json'
            },
            ext: {
                options: {
                    format: true,
                    ext: {
                        level: 1
                    }
                },
                src: [BASE + '**'],
                dest: 'tmp/ext.json'
            },
            exclude: {
                src: [
                    BASE + '**', 
                    '!' + BASE + 'c'
                ],
                dest: 'tmp/exclude.json'
            },
            base: {
                options : {
                    base: BASE
                },
                src: [BASE + '**'],
                dest: 'tmp/base.json'
            },
            multiple: {
                files: [
                    {
                        src: [BASE + '**', '!' + BASE + 'c'],
                        dest: 'tmp/multiple1.json'
                    },{
                        src: [BASE + '**', '!' + BASE + 'a.css'],
                        dest: 'tmp/multiple2.json'
                    }
                ]
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js'],
        },

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
