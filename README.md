# grunt-tree
Parse a directory to a tree with json format.

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

Anyway, see the examples.

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

// 6. try to mix the options, and have a look.
...

```
### Test
```shell
# Once you run the follow command in console, you should run `npm install` before.
grunt test
```

## Release History

1. Compatibility fix for node 0.10.x [2013/04/12]
2. Add nodeunit test case [2013/04/12]
