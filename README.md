# grunt-tree v1.1.1
> Parse a directory to a tree with json format.

## Why I writen this plugin?
I need build my static files with md5 version. The follows is what I want to get:
``` js
// static.json
{
    "static/js/base.js": "xxxx-base.js",
    "static/img/logo.png": "xxxx-logo.png",
    "static/css/base.css": "xxxx-base.css"
}
```
Then, I do not need care about the cache of static files in production environment by create files with md5 version.

Only I need to do is create a get static files function to get it.

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
        // hash: String, default: null, like 'md5' or 'sha1'
        // hashLen: Number, default: null
        // format: Boolean, default: false
        // type: Array, default: null
        // recurse: Boolean, default: true
        // cwd: String, default: ""
        // prettify: Boolean|number, default: 0
        // outputType: Array, default: null
        // outputDirectory: String, default: false
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

#### options.hash
Type: `String`
Default value: `null`.

Get the hash value of the file and insert before the file name with '-'. Value is the algorithm name, like md5,sha1.

#### options.hashLen
Type: `Number`
Default value: `false`

Get the substring of hash value of file. `hashValue.substring(0, options.hashLen)`

#### options.format
Type: `Boolean`
Default value: `false`

A boolean value that you want the format of result.

The Default result is the tree format like the command tree.

And if format set to true, then output a one-to-one mode.

#### options.type
Type: `Array`
Default value: `null`

Filter the postfix of the files you set. This is can be replaced by set `src` option with pattern.

#### options.recurse
Type: `Boolean`
Default value: `true`

Whether recurse in your given directory.

#### options.cwd
Type: `String`
Default Value: `''`

Relative to the src directory.

#### options.prettify
Type: `Boolean|Number`
Default value: `0`.

For output style, if set to true, It is equivalent to `JSON.stringify(json, null, 4)`.

Anyway, see the examples.

#### options.outputType
Type: `Array`
Default value: `null`
Add in version `1.1.1`

Filter the postfix of the files you set to output.

#### options.outputDirectory
Type: `String`
Default value: `false`
Add in version `1.1.1`

The directory of files output.

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
    "a.css": "a.css",
    "js": {
        "b.js": "b.js"
    },
    "c": "c"
}

// 2. change the options to: { hash: 'md5', hashLen : 8 }, and result will be like:
{
    "a.css": "e8dcfa25-a.css",
    "js": {
        "b.js": "59efd297-b.js"
    },
    "c": "a8e91771-c"
}

// 3. change the options to: { format: true }, and result will be like:

{
    "a.css": "a.css",
    "js/b.js": "b.js"
    "c": "c"
}

// 4. change the options to: { type: ["js", "css"] }, and result will be like:
{
    "a.css": "a.css",
    "js": {
        "b.js": "b.js"
    }
}

// 5. change the options to: { recurse: false }, and result will be like:
{
    "a.css": "a.css",
    "c": "c"
}

// 6. change the options to: { outputType: ['js'], outputDirectory: '/tmp' }, and result will be like:
// /tmp/output.json
{
    "a.css": "a.css",
    "js": {
        "b.js": "b.js"
    },
    "c": "c"
}
// New file created in /tmp directory
// /tmp/b.js


// 7. try to mix the options, and have a look.
...

### Test
```shell
npm run-script test

# Once you run the follow command in console, you should run `npm install` before.
# grunt test
```

## Last

About the version. The first version is the same with `grunt` first version.

## Release History

1. New Start. [2016/02/27] => for 1.0.1
2. Add `option.outputType` and `option.outputDirectory`. [2016/02/29] => for 1.1.1
