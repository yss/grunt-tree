# grunt-tree
Parse a directory to a tree with json format.

## Why I writen this plugin?
I need build my static files with md5 version. I want to get this:
``` js
// js.json
{
    "base": "js/base.xxx.js",
    "jquery": "js/jquery.xxx.js"
}
// or
{
    "www-base": "www/js/base.xxx.js",
    "mobile-base": "mobile/js/base.xxx.js"
}
// css.json
{
    "base": "css/base.xxx.css"
}
```
Then, I can get the real path via a function, no matter what the environment is development or production.

> The best Grunt plugin ever.

## Getting Started
This plugin requires Grunt `>=0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-tree --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-tree');
```

## The "tree" task

### Overview
In your project's Gruntfile, add a section named `tree` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  tree: {
    options: {
        // md5: boolean or number [1-32] | default: false
        // format: | boolean default: false
        // type: array | default: []
        // recurse: boolean | default: true
    },
    your_target: {
      /** contents like this:
        files: [
            {
                src: ['relativePath/'],
                dest: 'saveTheResult/'
            }
        ]
      */
    },
  },
})
```

### Options

#### options.md5
Type: `Boolean|Number`
Default value: `false`

Get the md5 value of the file and put in file name. If the value is number, then cut the full md5 value to the length.

#### options.format
Type: `Boolean`
Default value: `false`

A boolean value that what you want the format of result to be.

The Default result is the tree format like the command tree.

And if format set to true, then output a one-to-one mode. Becareful to set format to true, it will overwrite the same file name.

#### options.type
Type: `Array`
Default value: `false`

Filter the postfix of the files you set.

#### options.recurse
Type: `Boolean`
Default value: `true`

Whether recurse in your given directory.

#### options.cwd
Type: `String`
Default Value: `''`

Relative to the src directory.

#### options.ext
Type: `Object`
Default value: `{ level:0, hyphen: "-" }`

There is a new option for resolve the problem of the same name in file. 
And the form option must be set to true.

The level option in options.ext means the subdirectory level.
If file relative path is 'www/css/base.css' and level set to 1, then the result will be: `"www-base": "www/css/base.css"`.
And if level set to 2, then the result will be: `"css-base": "www/css/base.css"`. But you set level to 3 in this condition, the result also is : `"base": "www/css/base.css"`.

Anyway, see the examples.

### Caution
This task is not support `Building the files object dynamically` in configuring-tasks of grunt.

Go to [Building the files object dynamically](http://gruntjs.com/configuring-tasks#building-the-files-object-dynamically), see more infomation.

### Usage Examples

#### Default Options

```js
grunt.initConfig({
    tree: {
        default: {
            options: {},
            files: [
                {
                    src: ['test/'],
                    dest: '/tmp/test.json'
                }
            ]
        }
    }
});

// If the have files: "a.css", "js/b.js", "c" in the test directory,
// 1. run grunt, then the result will like:
{
    "a": "a.css",
    "js": {
        "b": "js/b.js"
    },
    "c": "c"
}

// 2. change the options to: { md5 : 8 }, and result will be like:
{
    "a": "a.e8dcfa25.css",
    "js": {
        "b": "js/b.59efd297.js"
    },
    "c": "c.a8e91771"
}

// 3. change the options to: { format: true }, and result will be like:

{
    "a": "a.css",
    "b": "js/b.js"
    "c": "c"
}

// 4. change the options to: { type: ["js", "css"] }, and result will be like:
{
    "a": "a.css",
    "js": {
        "b": "js/b.js"
    }
}

// 5. change the options to: { recurse: false }, and result will be like:
{
    "a": "a.css",
    "c": "c"
}

// 6. change the options to : { format: true, ext: { level: 1, hyphen: "-" } }, and result will be like:
// Attention: if we use ext option, and the format must be set to true.
{
    "a": "a.css",
    "c":"c",
    "js-b":"js/b.js"
}
// 7. try to mix the options, and have a look.
...

```
#### Two real example
```js
var APP_NAME = 'imovie',
    PATH_TMP = 'tmp/';

var deps = {};

function getVersion(filepath, jsonFile, grunt) {
    grunt.log.writeln(filepath, jsonFile).ok();
    if (!deps[jsonFile]) {
        deps[jsonFile] = grunt.file.readJSON(jsonFile);
        grunt.log.writeln('Loading file:', jsonFile);
        grunt.log.writeln('Content is:', deps[jsonFile]);
    }
    var filename = filepath.match(/(?:^|\/)([^\/]+)\.(js|css|less)$/)[1];
    return deps[jsonFile][filename];
}

module.exports = function(grunt) {
    var config = {
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                compress: true,
                banner: '/*! ©<%= pkg.name %> <%= pkg.version %> */\n'
            },
            build: {
                files: [
                    {
                        expand: true,
                        cwd: PATH_SRC,
                        src: [APP_NAME + '/*.js', APP_NAME + '/**/*.js'],
                        dest: PATH_DEST,
                        ext: '.js',
                        rename: function(dest, src) {
                            var version = getVersion(src, PATH_TMP + APP_NAME + '.json', grunt);
                            return version && (dest + version);
                        }
                    }
                ]
            }
        },
        tree: {
            options: {
                format: true,
                md5: 8
            },
            js: {
                options: {
                    cwd: APP_NAME + '/',
                    type: ['js']
                },
                files: [
                    {
                        src: PATH_SRC,
                        dest: PATH_TMP + APP_NAME + '.json'
                    }
                ]
            }
        }
    };
    grunt.initConfig(config);
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-tree');

    grunt.registerTask('builddeps', 'build static dependencies for mobile project base on freemarker', function() {
        var jsContent = grunt.file.read(PATH_TMP + APP_NAME + '.json'),
            cssContent = grunt.file.read(PATH_TMP + APP_NAME + 'css.json');

        grunt.file.write(FILE_STATIC, '<#assign JS_FILE=' + jsContent + ' CSS_FILE=' + cssContent + '>');
    });

    grunt.registerTask('default', ['tree','uglify', 'builddeps']);

});
```

```js
// Gruntfile.js

var STATIC_PATH = 'static/',
    BUILD_PATH = 'build/';

module.exports = function(grunt) {
    var config = {
        tree: {
            js: {
                options: {
                    format: true,
                    md5: 8,
                    type: ['js'],
                    ext: {
                        level: 1
                    }
                },
                files: [
                    {
                        src: [STATIC_PATH],
                        dest: BUILD_PATH + 'data/js.json'
                    }
                ]
            },
            css: {
                options: {
                    format: true,
                    md5: 8,
                    type: ['css'],
                    ext: {
                        level: 1
                    }
                },
                files: [
                    {
                        src: [STATIC_PATH],
                        dest: BUILD_PATH + 'data/css.json'
                    }
                ]
            }
        },
        genStaticConfig: {
            build: []
        }
    };

    // Project Configuration
    grunt.initConfig(config);

    // load grunt tree module.
    grunt.loadNpmTasks('grunt-tree');

    grunt.registerMultiTask('genStaticConfig', 'generate static config files with js.json and css.json', function() {
        grunt.config('tree.css.options.md5', false);
        var files = grunt.config('tree.css.files');
        files[0].dest = 'data/css.json';
        grunt.config('tree.css.files', files);

        grunt.config('tree.js.options.md5', false);
        files = grunt.config('tree.js.files');
        files[0].dest = 'data/js.json';
        grunt.config('tree.js.files', files);
    });
    
    // for production
    grunt.registerTask('static', ['tree']);
    // for development
    grunt.registerTask('buildstatic', ['genStaticConfig', 'tree']);
};
```

### Test
```shell
# Once you run the follow command in console, you should run `npm install` before.
grunt test
```

## Release History

1. Compatibility fix for node 0.10.x. [2013/04/12] => for 0.4.1
2. Add nodeunit test case. [2013/04/12] => for 0.4.2
3. Add `ext` option for avoid the same name of key. [2013/06/03] => for 0.4.3
4. Add `cwd` option for flexible configuration.  [2013/07/23] => for 0.4.4
