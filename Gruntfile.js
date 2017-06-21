module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        license: { name: 'MIT', url: 'https://raw.githubusercontent.com/LouisT/MapQL/master/LICENSE' },
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*!\n * MapQL v<%= pkg.version %> - <%= pkg.description %> - Copyright (c) 2017 <%= pkg.author.name %>' +
                ' (<%= pkg.author.web %>)\n * Licensed under the <%= license.name %> license - <%= license.url %>' +
                '\n * Updated on <%= grunt.template.today("dd-mm-yyyy") %> at <%= grunt.template.today("HH:mm:ss") %>\n */',
        clean: {
           default: ['dist/*']
        },
        browserify: {
            default: {
                files: {
                    'dist/MapQL.es6.js': ['./index.js'],
                    'dist/MapQL.es6.chainable.js': ['./chainable/index.js']
                }
            },
            babelify: {
                options: {
                    transform: [[ 'babelify', {
                        presets: ['es2015'],
                        plugins: [
                            ["babel-plugin-transform-builtin-extend", {
                                globals: ["Array", "Map"]
                            }],
                            ["transform-runtime", {
                                polyfill: false,
                                regenerator: true
                            }]
                        ]
                    }]]
                },
                files: {
                    'dist/MapQL.es5.js': ['./transpile/polyfill.js'],
                    'dist/MapQL.es5.chainable.js': ['./transpile/chainable.js']
                }
            }
        },
        uglify: {
            default: {
                files: {
                    'dist/MapQL.es5.js': ['dist/MapQL.es5.js'],
                    'dist/MapQL.es5.chainable.js': ['dist/MapQL.es5.chainable.js']
                }
           }
        },
        comments: {
            default: {
                options: {
                    singleline: true,
                    multiline: true,
                    keepSpecialComments: false
                },
                src: ['dist/*.js']
            }
        },
        usebanner: {
            default: {
                options: {
                    position: 'top',
                    banner: '<%= banner %>',
                    linebreak: true
                },
                files: {
                    src: ['dist/MapQL.es6.js', 'dist/MapQL.es5.js']
                }
            },
            chainable: {
                options: {
                    position: 'top',
                    banner: '<%= banner %>',
                    linebreak: true
                },
                files: {
                    src: ['dist/MapQL.es6.chainable.js', 'dist/MapQL.es5.chainable.js']
                }
            }
        }
    });
    grunt.registerTask('default', ['clean', 'browserify:default', 'browserify:babelify', 'uglify', 'comments', 'usebanner']);
};
