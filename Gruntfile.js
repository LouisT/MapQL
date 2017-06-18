module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        license: { name: 'MIT', url: 'https://raw.githubusercontent.com/LouisT/MapQL/master/LICENSE' },
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*!\n * MapQL v<%= pkg.version %> - <%= pkg.description %> - Copyright (c) 2017 <%= pkg.author.name %>' +
                ' (<%= pkg.author.web %>)\n * Licensed under the <%= license.name %> license - <%= license.url %>' +
                '\n * Updated on <%= grunt.template.today("dd-mm-yyyy") %> at <%= grunt.template.today("HH:mm:ss") %>\n */\n',
        clean: {
           default: ['dist/*']
        },
        browserify: {
            'dist/MapQL.es6.js': ['./index.js'],
            'dist/MapQL.es6.chainable.js': ['./chainable/index.js']
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
                    src: ['dist/MapQL.es6.js']
                }
            },
            chainable: {
                options: {
                    position: 'top',
                    banner: '<%= banner %>',
                    linebreak: true
                },
                files: {
                    src: ['dist/MapQL.es6.chainable.js']
                }
            }
        }
    });
    grunt.registerTask('default', ['clean', 'browserify', 'comments', 'usebanner']);
};
